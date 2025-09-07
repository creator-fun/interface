export interface SIWMessage {
    domain: string; // The authority that is requesting the signing.
    address: string; // The blockchain address that is performing the signing.
    statement?: string; // A human-readable ASCII assertion that the user will sign. It MUST NOT contain \\n
    uri: string; // A URI referring to the resource that is the subject of the signing—that is, the subject of the claim.
    version: string; // The current version of the message.
    chainId: string; // The Chain ID to which the session is bound, and the network where Contract Accounts MUST be resolved.
    nonce: string; // A randomized token to prevent signature replay attacks.
    issuedAt: string; // The issuance time.
    expirationTime?: string; // The time at which the signed authentication message is no longer valid.
    notBefore?: string; // The time at which the signed authentication message starts being valid.
    requestId?: string; // A system-specific identifier used to uniquely refer to the authentication request.
    resources?: string[]; // A list of URIs the user wishes to have resolved as part of the authentication by the relying party.
}