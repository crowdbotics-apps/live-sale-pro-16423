import { gql } from '@apollo/client'

export const GET_SHOP_ID = gql`{ primaryShopId }`

export const LIVE_SALES_EVENTS_1 = (shopId: string) => gql`
{
    liveSalesEvents(shopId: "${shopId}") {
        nodes {
            title
            startDate
        }
    }
}`

export const GET_LIVE_SALES_EVENTS = gql`
    query LiveSalesEvents($shopId: String!) {
        liveSalesEvents(shopId: $shopId) {
            nodes {
                title
                startDate
            }
        }
    }`