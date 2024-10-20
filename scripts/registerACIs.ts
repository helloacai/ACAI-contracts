import hre from 'hardhat';
import { PinataSDK } from "pinata";
import 'dotenv/config'
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { ACS, ACS__factory, ACIRegistry, ACIRegistry__factory } from '../typechain';

const agents = [
    {
        executor: '0x17F5E274c2c8AA9471e5320Cb68Df543Db90D083',
        api_url: 'https://coordinatingagent.onrender.com',
        metadata: {
            "name": "Coordinating Agent",
            "description": "The Coordinating Agent can answer requests by coordinating amongst other agents",
            "tools": [
              "get_all_agents: list all available agents",
              "call_agent: call an agent to handle a portion of the request"
            ],
            "baseUrl": "https://coordinatingagent.onrender.com",
            "postRoute": {
              "uri": "/thread",
              "method": "POST",
              "bodyParams": [
                {
                  "name": "requestRef",
                  "value": "$requestRef"
                },
                {
                  "name": "threadUID",
                  "value": "$threadUID"
                }
              ]
            },
            "patchRoute": {
              "uri": "/thread",
              "method": "PATCH",
              "bodyParams": [
                {
                  "name": "requestRef",
                  "value": "$requestRef"
                },
                {
                  "name": "threadUID",
                  "value": "$threadUID"
                }
              ]
            }
        }
    },
    {
        executor: '0x980B3A841817E0c7cBfc921BfCCf796Fa84c80f3',
        api_url: 'https://gcalagent.onrender.com',
        metadata: {
            "name": "GCal Agent",
            "description": "The GCal Agent can create google calendar events",
            "tools": [
              "create_event: create google calendar events"
            ],
            "baseUrl": "https://gcalagent.onrender.com",
            "postRoute": {
              "uri": "/thread",
              "method": "POST",
              "bodyParams": [
                {
                  "name": "requestRef",
                  "value": "$requestRef"
                },
                {
                  "name": "threadUID",
                  "value": "$threadUID"
                }
              ]
            },
            "patchRoute": {
              "uri": "/thread",
              "method": "PATCH",
              "bodyParams": [
                {
                  "name": "requestRef",
                  "value": "$requestRef"
                },
                {
                  "name": "threadUID",
                  "value": "$threadUID"
                }
              ]
            }
          }
    },
    {
        executor: '0xC04c0B99b0B50E61f6a71F43e18871803c2BA2AF',
        api_url: 'https://searchagent-zsjj.onrender.com',
        metadata: {
            "name": "Search Agent",
            "description": "The Search Agent can answer requests by searching the web and analyzing the top 3 responses to appropriately answer the request",
            "tools": [
              "web_search: Search the web and return the top 3 results using the Tavily API"
            ],
            "baseUrl": "https://searchagent-zsjj.onrender.com",
            "postRoute": {
              "uri": "/thread",
              "method": "POST",
              "bodyParams": [
                {
                  "name": "requestRef",
                  "value": "$requestRef"
                },
                {
                  "name": "threadUID",
                  "value": "$threadUID"
                }
              ]
            },
            "patchRoute": {
              "uri": "/thread",
              "method": "PATCH",
              "bodyParams": [
                {
                  "name": "requestRef",
                  "value": "$requestRef"
                },
                {
                  "name": "threadUID",
                  "value": "$threadUID"
                }
              ]
            }
          }
    },
    {
        executor: '0x7b5d5f79934F4995A5d9214B6701E98e903d26c7',
        api_url: 'https://yelpagent.onrender.com',
        metadata: {
            "name": "Yelp Agent",
            "description": "The Yelp Agent can make restaurant reservations using the yelp api",
            "tools": [
              "get_all_restaurants: list restaurants from yelp",
              "reserve_restaurant: make a restaurant reservation"
            ],
            "baseUrl": "https://yelpagent.onrender.com",
            "postRoute": {
              "uri": "/thread",
              "method": "POST",
              "bodyParams": [
                {
                  "name": "requestRef",
                  "value": "$requestRef"
                },
                {
                  "name": "threadUID",
                  "value": "$threadUID"
                }
              ]
            },
            "patchRoute": {
              "uri": "/thread",
              "method": "PATCH",
              "bodyParams": [
                {
                  "name": "requestRef",
                  "value": "$requestRef"
                },
                {
                  "name": "threadUID",
                  "value": "$threadUID"
                }
              ]
            }
          }
    },
]


async function registerACI() {
    const signers = await hre.ethers.getSigners();

    const signer = signers[0];

    const ACIRegistry = ACIRegistry__factory.connect("0x67d75De4eEA0b11B40fd0EdA5bDb2B95319Ce9e1", signer) as ACIRegistry;


    const pinata = new PinataSDK({
        pinataJwt: process.env.PINATA_JWT,
        pinataGateway: "aquamarine-big-mink-835.mypinata.cloud",
      });
    
    for(var agent of agents) {

        const pinResponse = await pinata.upload.json(agent.metadata)

        if(pinResponse?.IpfsHash) {
            const tx = await ACIRegistry.register(
                agent.executor, // Executor
                0, // Cost
                0, // CostPer
                pinResponse?.IpfsHash, // MetadataURI
                agent.api_url // APIURL
            )
        
            const receipt = await tx.wait();
        
            console.log(receipt)
        } else {
            console.log("Oops couldn't get metadata uri")
        }
    }
}

registerACI().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});