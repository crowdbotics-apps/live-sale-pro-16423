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
                inputUrl
                outputUrl
                status
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
query GetIngestServerDetails($shopId: ID!, $eventId: ID!) {
    getIngestServerDetails(shopId: $shopId, eventId: $eventId){
        name
        shopId
        status
        dns
        ip
        inputUrl
        outputUrl
        eventId
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