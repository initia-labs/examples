use cosmwasm_schema::{cw_serde, QueryResponses};
use slinky_wasm::oracle::{GetAllCurrencyPairsResponse, GetPriceResponse, GetPricesResponse};

#[cw_serde]
pub struct InstantiateMsg {
    pub slinky: String,
}

#[cw_serde]
pub enum ExecuteMsg {
    Increment {},
    Reset { count: i32 },
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    #[returns(GetAllCurrencyPairsResponse)]
    ExampleGetAllCurrenyPairs {},
    #[returns(GetPriceResponse)]
    ExampleGetPrice {},
    #[returns(GetPricesResponse)]
    ExampleGetPrices {},
}

// We define a custom struct for each query response
#[cw_serde]
pub struct GetCountResponse {
    pub count: i32,
}
