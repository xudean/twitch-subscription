import {PrimusZKTLS} from "@primuslabs/zktls-js-sdk"

// Initialize parameters.
const primusZKTLS = new PrimusZKTLS();

//**** Set appId and appSecret here!!!
const appId = '';
const appSecret = '';
if(!appId || !appSecret){
    alert("appId or appSecret is not set.")
    throw new Error("appId or appSecret is not set.");
}

const initAttestaionResult = await primusZKTLS.init(appId, appSecret);
console.log("primusProof initAttestaionResult=", initAttestaionResult);

export async function primusProofTest(login: string,callback: (attestation: string) => void) {
    // Set TemplateID and user address.
    const attTemplateID = "515fd5af-49be-48e7-9345-d949c76e5f0d";
    // ***You change address according to your needs.***
    const userAddress = "0x7ab44DE0156925fe0c24482a2cDe48C465e47573";
    // Generate attestation request.
    const request = primusZKTLS.generateRequestParams(attTemplateID, userAddress);
    request.setAttConditions([
        [
            {
                type: "CONDITION_EXPANSION",
                op: "MATCH_ONE",
                key: "login",
                field: "$[0].data.currentUser.subscriptionBenefits.edges[*]+",
                value: [
                    {
                        type: "FIELD_RANGE",
                        op: "STREQ",
                        field: "+.node.user.login",
                        value: login,
                    },
                ],
            },
        ],
    ]);
    // request.setAttMode({
    //     algorithmType: "proxytls"
    // });

    // Transfer request object to string.
    const requestStr = request.toJsonString();

    // Sign request.
    const signedRequestStr = await primusZKTLS.sign(requestStr);

    // Start attestation process.
    const attestation = await primusZKTLS.startAttestation(signedRequestStr);
    console.log("attestation=", attestation);

    // Verify siganture.
    const verifyResult = await primusZKTLS.verifyAttestation(attestation)
    console.log("verifyResult=", verifyResult);

    if (verifyResult === true) {
        // Business logic checks, such as attestation content and timestamp checks
        // do your own business logic.
        callback(attestation)
    } else {
        // If failed, define your own logic.
    }
}