import hre from 'hardhat';
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { ACS, ACS__factory } from '../typechain';


async function openThread() {
    const signers = await hre.ethers.getSigners();

    

    const signer = signers[0];

    const ACSContract = ACS__factory.connect("0xBc0c75001dA750f02A56063c27F478352064831D", signer) as ACS;

    

    const tx = await ACSContract.request(hre.ethers.ZeroHash, hre.ethers.ZeroHash, "0x7f9ee9cf9c3cfa7efc8c68a2f798808f6c1adba2b176c09c1d29225b2ff77777", "AI GRANT ME SUPERPOWERS!")

    const receipt = await tx.wait();

    console.log(receipt)

}

openThread().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});