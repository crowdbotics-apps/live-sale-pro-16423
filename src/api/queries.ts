import { gql } from '@apollo/client'

export const GET_SHOP_ID = gql`{ 
    primaryShopId 
}`

export const GET_LIVE_SALES_EVENTS = gql`
    query LiveSalesEvents($shopId: ID!) {
        liveSalesEvents(shopId: $shopId) {
            nodes {
                _id
                title
                streamTarget
                startDate
                claimWord
                includedUrl
            }
        }
    }`

export const CREATE_INGEST_SERVER = gql`
mutation CreateIngestServer($input: CreateIngestServerInput!) {
    createIngestServer(input: $input) {
        name
        status
        _id
        eventId
    }
}`

export const GET_INGEST_SERVER_DETAILS = gql`
query GetIngestServerDetails($shopId: ID!, $serverId: ID!) {
    getIngestServerDetails(shopId: $shopId, serverId: $serverId){
        name
        shopId
        status
        dns
        ip
        inputUrl
        outputUrl
    }
}`

export const DELETE_INGEST_SERVER = gql`
    mutation StopIngestServer($input: DeleteIngestServerInput!) {
        deleteIngestServer(input: $input){
            name
            status
        }
    }`

export const LIST_INGEST_SERVER = gql`
    mutation StopIngestServer($input: DeleteIngestServerInput!) {
        deleteIngestServer(input: $input){
            name
            status
        }
    }`