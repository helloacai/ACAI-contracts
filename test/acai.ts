import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from 'hardhat';
import { getAddress, parseGwei } from "viem";
import { deployments, ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { ACIRegistry, ACIRegistry__factory, IACIRegistry, IACIRegistry__factory } from '../typechain'

enum CostPer {
  Token,
  Job
}

describe("Likes", function () {

  let signers: SignerWithAddress[];

  before(async () => {
    await deployments.fixture('ACAI');
    signers = await ethers.getSigners();
  })

  describe("ACI Registration", function () {

    it("Should successfully register ACI", async function () {
      const ACIRegistry = await deployments.get('ACIRegistry');
      const ACIRegistryContract = await ACIRegistry__factory.connect(ACIRegistry.address, signers[0]);

      const transaction = await ACIRegistryContract.register(
        ethers.ZeroAddress,
        1,
        CostPer.Token,
        "",
        ""
      )

      const receipt = await transaction.wait();

      const registeredLog = receipt?.logs.filter(log => ACIRegistry__factory.createInterface().parseLog(receipt!.logs[0])?.name == "Registered")

      const uid = ACIRegistry__factory.createInterface().parseLog(registeredLog![0])?.args[0]

      console.log(uid);


    });
  });
});
