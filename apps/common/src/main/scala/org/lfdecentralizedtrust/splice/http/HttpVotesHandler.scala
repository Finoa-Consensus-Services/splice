// Copyright (c) 2024 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

package org.lfdecentralizedtrust.splice.http

import org.lfdecentralizedtrust.splice.admin.http.HttpErrorHandler
import org.lfdecentralizedtrust.splice.codegen.java.splice
import org.lfdecentralizedtrust.splice.codegen.java.splice.dsorules.VoteRequest
import org.lfdecentralizedtrust.splice.http.v0.definitions
import org.lfdecentralizedtrust.splice.store.ActiveVotesStore
import org.lfdecentralizedtrust.splice.util.{Contract, VoteRequestContractUtil}
import com.digitalasset.canton.logging.NamedLogging
import com.digitalasset.canton.tracing.{Spanning, TraceContext}
import io.opentelemetry.api.trace.Tracer

import java.time.Instant
import scala.concurrent.{ExecutionContext, Future}

trait HttpVotesHandler extends Spanning with NamedLogging {

  protected val votesStore: ActiveVotesStore
  protected val workflowId: String
  protected implicit val tracer: Tracer

  /** Resolve the original VoteRequest creation time for the given tracking contract id.
    *
    * Implementations must use historical create data (e.g. Scan update history), not ACS
    * `created_at` / `lookupDsoRulesVoteRequest`. `CastVote` recreates the contract; ACS
    * `created_at` is then the recreation time. TxLog `VoteRequestTxLogEntry` only covers
    * closed votes and cannot fix open Action Required rows.
    */
  protected def voteRequestOriginalCreatedAt(
      trackingId: VoteRequest.ContractId
  )(implicit
      tc: TraceContext,
      ec: ExecutionContext,
  ): Future[Option[Instant]]

  private def voteRequestToHttp(
      voteRequest: Contract[VoteRequest.ContractId, VoteRequest]
  )(implicit
      tc: TraceContext,
      ec: ExecutionContext,
  ): Future[definitions.Contract] =
    if (VoteRequestContractUtil.needsOriginalCreatedAtLookup(voteRequest)) {
      voteRequestOriginalCreatedAt(VoteRequestContractUtil.trackingId(voteRequest)).map {
        case Some(originalCreatedAt) =>
          VoteRequestContractUtil
            .withCreatedAt(voteRequest, originalCreatedAt)
            .toHttp
        case None => voteRequest.toHttp
      }
    } else {
      Future.successful(voteRequest.toHttp)
    }

  private def voteRequestsToHttp(
      voteRequests: Seq[Contract[VoteRequest.ContractId, VoteRequest]]
  )(implicit
      tc: TraceContext,
      ec: ExecutionContext,
  ): Future[Vector[definitions.Contract]] =
    Future.traverse(voteRequests)(voteRequestToHttp).map(_.toVector)

  def listDsoRulesVoteRequests(implicit
      tc: TraceContext,
      ec: ExecutionContext,
  ): Future[definitions.ListDsoRulesVoteRequestsResponse] = {
    withSpan(s"$workflowId.listDsoRulesVoteRequests") { _ => _ =>
      for {
        dsoRulesVoteRequests <- votesStore.listVoteRequests()
        voteRequests <- voteRequestsToHttp(dsoRulesVoteRequests)
      } yield definitions.ListDsoRulesVoteRequestsResponse(voteRequests)
    }
  }

  def listVoteRequestsByTrackingCid(body: definitions.BatchListVotesByVoteRequestsRequest)(implicit
      tc: TraceContext,
      ec: ExecutionContext,
  ): Future[definitions.ListVoteRequestByTrackingCidResponse] = {
    withSpan(s"$workflowId.listVoteRequestsByTrackingCid") { _ => _ =>
      for {
        dsoRulesVotes <- votesStore.listVoteRequestsByTrackingCid(
          body.voteRequestContractIds.map(new splice.dsorules.VoteRequest.ContractId(_))
        )
        voteRequests <- voteRequestsToHttp(dsoRulesVotes)
      } yield definitions.ListVoteRequestByTrackingCidResponse(voteRequests)
    }
  }

  def lookupDsoRulesVoteRequest(voteRequestContractId: String)(implicit
      tc: TraceContext,
      ec: ExecutionContext,
  ): Future[definitions.LookupDsoRulesVoteRequestResponse] = {
    withSpan(s"$workflowId.lookupDsoRulesVoteRequest") { _ => _ =>
      votesStore
        .lookupVoteRequest(
          new splice.dsorules.VoteRequest.ContractId(voteRequestContractId)
        )
        .flatMap {
          case Some(voteRequest) =>
            voteRequestToHttp(voteRequest).map(definitions.LookupDsoRulesVoteRequestResponse(_))
          case None =>
            Future.failed(
              HttpErrorHandler.notFound(
                s"No VoteRequest found contract: $voteRequestContractId"
              )
            )
        }
    }
  }

}
