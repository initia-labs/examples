// query response
use cosmwasm_std::{Timestamp, Uint256};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, PartialEq, JsonSchema, Debug)]
pub struct InstantiateMsg {}

#[derive(Serialize, Deserialize, Clone, PartialEq, JsonSchema, Debug)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    Foo {},
}

#[derive(Serialize, Deserialize, Clone, PartialEq, JsonSchema, Debug)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    GetPrice { base: String, quote: String },
    GetPrices { pair_ids: Vec<String> },
    GetAllCurrencyPairs {},
}

#[derive(Clone, Debug, PartialEq, serde::Deserialize, serde::Serialize, JsonSchema)]
pub struct GetPriceResponse {
    pub price: QuotePrice,
    pub nonce: u64,
    pub decimals: u64,
    pub id: u64,
}

#[derive(Clone, Debug, PartialEq, serde::Deserialize, serde::Serialize, JsonSchema)]
pub struct GetPricesResponse {
    pub prices: Vec<GetPriceResponse>,
}

#[derive(Clone, Debug, PartialEq, serde::Deserialize, serde::Serialize, JsonSchema)]
pub struct QuotePrice {
    pub price: Uint256,
    pub block_timestamp: Timestamp,
    pub block_height: u64,
}

#[derive(Clone, Debug, PartialEq, serde::Deserialize, serde::Serialize, JsonSchema)]
pub struct GetAllCurrencyPairsResponse {
    pub currency_pairs: Vec<CurrencyPairResponse>,
}
#[derive(Clone, Debug, PartialEq, serde::Deserialize, serde::Serialize, JsonSchema)]
#[allow(non_snake_case)]
pub struct CurrencyPairResponse {
    pub Base: String,
    pub Quote: String,
}
