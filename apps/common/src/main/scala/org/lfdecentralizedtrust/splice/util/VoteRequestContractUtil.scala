// Copyright (c) 2024 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

package org.lfdecentralizedtrust.splice.util

import org.lfdecentralizedtrust.splice.codegen.java.splice.dsorules.VoteRequest

import java.time.Instant
import scala.jdk.OptionConverters.*

object VoteRequestContractUtil {

  def trackingId(
      contract: Contract[VoteRequest.ContractId, VoteRequest]
  ): VoteRequest.ContractId =
    contract.payload.trackingCid.toScala.getOrElse(contract.contractId)

  /** Vote requests are recreated when votes are cast; only then is a lookup needed. */
  def needsOriginalCreatedAtLookup(
      contract: Contract[VoteRequest.ContractId, VoteRequest]
  ): Boolean =
    contract.payload.trackingCid.toScala.exists(_ != contract.contractId)

  def withCreatedAt(
      contract: Contract[VoteRequest.ContractId, VoteRequest],
      createdAt: Instant,
  ): Contract[VoteRequest.ContractId, VoteRequest] =
    contract.copy(createdAt = createdAt)
}
