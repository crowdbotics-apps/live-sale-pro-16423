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
    mutation CreateIngestServer($input: String!) {
        createIngestServer(input: $shopId) {
            _id
            shopId
            eventId
            name
            tags
            ip
            dns
            status
        }
    }`