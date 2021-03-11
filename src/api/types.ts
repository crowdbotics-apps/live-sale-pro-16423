export type LiveSaleEvent = {
    _id: string,
    title: string
    streamTarget: string,
    startDate: string,
    claimWord: string,
    includedUrl: string
}

export type LivSalesRequest = { shopId: string }

export type LivSalesResponse = {
    liveSalesEvents: {
        nodes: Array<LiveSaleEvent>
    }
}

export type CreateIngestServerRequest = {
    input: {
        shopId: string,
        name: string,
        eventId: string
    }
}

export type CreateIngestServerResponse = {
    createIngestServer: {
        name: string,
        status: string,
        _id: string,
        eventId: string
    }
}

export type IngestServer = {
    name: string,
    shopId: string,
    status: string,
    dns: string,
    ip: string,
    inputUrl: string,
    outputUrl: string
}

export type IngestServerDetailsRequest = { shopId: string, serverId: string | undefined }
export type IngestServerDetailsResponse = { getIngestServerDetails: IngestServer }

export type DeleteIngestServerRequest = {
    input: {
        shopId: string,
        serverId: string | undefined
    }
}
export type DeleteIngestServerResponse = { deleteIngestServer: IngestServer }