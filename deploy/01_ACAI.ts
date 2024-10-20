import {addDeployedContract} from '../utils/helpers';
import {DeployFunction} from 'hardhat-deploy/types';
import {HardhatRuntimeEnvironment} from 'hardhat/types';
import { ethers } from 'ethers';


const name = 'ACAI';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Deploying ${name} contracts`);

  const {deployments, network, getNamedAccounts} = hre;
  const {deploy} = deployments;
  const {deployer} = await getNamedAccounts();

  const ACIRegistry = await deploy("ACIRegistry", {
    from: deployer,
    args: [],
    // deterministicDeployment: ethers.id("ACAI.443e20e5")
  });

  addDeployedContract(network.name, "ACIRegistry", ACIRegistry.address);
  
  const ACS = await deploy("ACS", {
    from: deployer,
    args: [ACIRegistry.address],
    // deterministicDeployment: ethers.id("ACAI.443e20e5")
  });

  addDeployedContract(network.name, "ACS", ACS.address);  
};

export default func;
func.tags = [name];