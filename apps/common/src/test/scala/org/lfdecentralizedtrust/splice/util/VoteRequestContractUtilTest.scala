package org.lfdecentralizedtrust.splice.util

import com.google.protobuf.ByteString
import org.lfdecentralizedtrust.splice.codegen.java.splice.dsorules.VoteRequest
import org.lfdecentralizedtrust.splice.codegen.java.splice.dsorules.actionrequiringconfirmation.ARC_DsoRules
import org.lfdecentralizedtrust.splice.codegen.java.splice.dsorules.dsorules_actionrequiringconfirmation.SRARC_AddSv
import org.lfdecentralizedtrust.splice.codegen.java.splice.dsorules.{DsoRules_AddSv, Reason}
import org.lfdecentralizedtrust.splice.codegen.java.splice.types.Round
import org.scalatest.matchers.should.Matchers
import org.scalatest.wordspec.AnyWordSpec

import java.time.Instant
import java.util.Optional
import scala.jdk.CollectionConverters.*

class VoteRequestContractUtilTest extends AnyWordSpec with Matchers {

  private val originalCreatedAt = Instant.parse("2025-12-29T10:00:00Z")
  private val updatedCreatedAt = Instant.parse("2026-07-14T10:00:00Z")

  private def voteRequestContract(
      contractId: String,
      trackingCid: Option[String],
      createdAt: Instant,
  ): Contract[VoteRequest.ContractId, VoteRequest] = {
    val action = new ARC_DsoRules(
      new SRARC_AddSv(
        new DsoRules_AddSv(
          "user666",
          "user666",
          10_000L,
          "user666ParticipantId",
          new Round(1L),
        )
      )
    )
    val payload = new VoteRequest(
      "dso",
      "sv1",
      action,
      new Reason("https://www.example.com", ""),
      createdAt.plusSeconds(3600),
      Map.empty[String, org.lfdecentralizedtrust.splice.codegen.java.splice.dsorules.Vote].asJava,
      trackingCid match {
        case Some(id) => Optional.of(new VoteRequest.ContractId(id))
        case None => Optional.empty()
      },
      Optional.empty(),
    )
    Contract(
      identifier = VoteRequest.TEMPLATE_ID_WITH_PACKAGE_ID,
      contractId = new VoteRequest.ContractId(contractId),
      payload = payload,
      createdEventBlob = ByteString.EMPTY,
      createdAt = createdAt,
    )
  }

  "VoteRequestContractUtil" should {
    "use the contract id as tracking id when trackingCid is unset" in {
      val contract = voteRequestContract("cid-1", None, originalCreatedAt)
      VoteRequestContractUtil.trackingId(contract).contractId shouldBe "cid-1"
      VoteRequestContractUtil.needsOriginalCreatedAtLookup(contract) shouldBe false
    }

    "require lookup when trackingCid differs from the current contract id" in {
      val contract =
        voteRequestContract("cid-2", Some("cid-1"), updatedCreatedAt)
      VoteRequestContractUtil.trackingId(contract).contractId shouldBe "cid-1"
      VoteRequestContractUtil.needsOriginalCreatedAtLookup(contract) shouldBe true
    }

    "replace createdAt when original creation time is known" in {
      val contract =
        voteRequestContract("cid-2", Some("cid-1"), updatedCreatedAt)
      VoteRequestContractUtil
        .withCreatedAt(contract, originalCreatedAt)
        .createdAt shouldBe originalCreatedAt
    }
  }
}
