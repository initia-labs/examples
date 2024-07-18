#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{to_json_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult};
use cw2::set_contract_version;
use slinky_wasm::oracle::{GetPriceResponse, GetPricesResponse};

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg};
use crate::state::{State, STATE};

// version info for migration info
const CONTRACT_NAME: &str = "crates.io:examples";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    let state = State {
        slinky: deps.api.addr_validate(&msg.slinky)?,
    };
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
    STATE.save(deps.storage, &state)?;

    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("slinky", msg.slinky))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    _deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    _msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    Ok(Response::new())
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::ExampleGetAllCurrenyPairs {} => {
            to_json_binary(&query::example_get_all_curreny_pairs(deps)?)
        }
        QueryMsg::ExampleGetPrice {} => to_json_binary(&query::example_get_price(deps)?),
        QueryMsg::ExampleGetPrices {} => to_json_binary(&query::example_get_prices(deps)?),
    }
}

pub mod query {
    use cosmwasm_std::{QueryRequest, WasmQuery};
    use slinky_wasm::oracle::GetAllCurrencyPairsResponse;

    use super::*;

    pub fn example_get_all_curreny_pairs(deps: Deps) -> StdResult<GetAllCurrencyPairsResponse> {
        let state = STATE.load(deps.storage)?;
        let slinky_addr = state.slinky;
        deps.querier.query(&QueryRequest::Wasm(WasmQuery::Smart {
            contract_addr: slinky_addr.to_string(),
            msg: to_json_binary(&slinky_wasm::oracle::QueryMsg::GetAllCurrencyPairs {})?,
        }))
    }

    pub fn example_get_price(deps: Deps) -> StdResult<GetPriceResponse> {
        let state = STATE.load(deps.storage)?;
        let slinky_addr = state.slinky;

        let base_asset = "BTC";
        let quote_asset = "USD";

        deps.querier.query(&QueryRequest::Wasm(WasmQuery::Smart {
            contract_addr: slinky_addr.to_string(),
            msg: to_json_binary(&slinky_wasm::oracle::QueryMsg::GetPrice {
                base: base_asset.to_string(),
                quote: quote_asset.to_string(),
            })?,
        }))
    }

    pub fn example_get_prices(deps: Deps) -> StdResult<GetPricesResponse> {
        let state = STATE.load(deps.storage)?;
        let slinky_addr = state.slinky;

        let pair_ids = vec!["BTC/USD".to_string(), "ETH/USD".to_string()];

        deps.querier.query(&QueryRequest::Wasm(WasmQuery::Smart {
            contract_addr: slinky_addr.to_string(),
            msg: to_json_binary(&slinky_wasm::oracle::QueryMsg::GetPrices { pair_ids })?,
        }))
    }
}
