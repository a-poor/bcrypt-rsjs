use bcrypt;
use neon::prelude::*;

const MIN_COST: u32 = 4;
const MAX_COST: u32 = 32;
const DEFAULT_COST: u32 = bcrypt::DEFAULT_COST;

const COST_OUT_OF_RANGE_ERR_MSG: &str = "hash cost out of range [4,32]";

/// JS Function Arguments:
/// - password: string
/// - rounds: uint (optional)
///
/// JS Function Return:
/// - string
fn js_sync_hash(mut cx: FunctionContext) -> JsResult<JsString> {
    // Get the arguments
    let arg_data = cx.argument::<JsString>(0)?;
    let arg_rounds = cx.argument_opt(1);

    // Get the underlying data
    let data = arg_data.value(&mut cx);
    let mut cost = DEFAULT_COST;

    // Check if a cost was supplied (otherwise uses default)
    if let Some(arg_rounds) = arg_rounds {
        // Convert from JsValue to JsNumber
        let rounds: Handle<JsNumber> = arg_rounds.downcast_or_throw(&mut cx)?;

        // Get the underlying value
        let n = rounds.value(&mut cx);

        // Check the value is in range
        if n < MIN_COST.into() {
            return cx.throw_error(COST_OUT_OF_RANGE_ERR_MSG);
        }
        if n > MAX_COST.into() {
            return cx.throw_error(COST_OUT_OF_RANGE_ERR_MSG);
        }

        // Set the cost
        cost = n as u32;
    }

    // Run the hash
    let h = bcrypt::hash(data, cost).expect("Unable to hash data.");

    // Return the result
    Ok(cx.string(h))
}

fn js_async_hash(mut cx: FunctionContext) -> JsResult<JsPromise> {
    // Get the arguments
    let arg_data = cx.argument::<JsString>(0)?;
    let arg_rounds = cx.argument_opt(1);

    // Get the underlying data
    let data = arg_data.value(&mut cx);
    let mut cost = DEFAULT_COST;

    // Check if a cost was supplied (otherwise uses default)
    if let Some(arg_rounds) = arg_rounds {
        // Convert from JsValue to JsNumber
        let rounds: Handle<JsNumber> = arg_rounds.downcast_or_throw(&mut cx)?;

        // Get the underlying value
        let n = rounds.value(&mut cx);

        // Check the value is in range
        if n < MIN_COST.into() {
            return cx.throw_error(COST_OUT_OF_RANGE_ERR_MSG);
        }
        if n > MAX_COST.into() {
            return cx.throw_error(COST_OUT_OF_RANGE_ERR_MSG);
        }

        // Set the cost
        cost = n as u32;
    }

    let promise = cx
        .task(move || bcrypt::hash(data, cost))
        .promise(move |mut cx, h| {
            let h = h.expect("Unable to hash data.");
            Ok(cx.string(h))
        });

    Ok(promise)
}

/// JS Function Arguments:
/// - password: string
/// - hash: string
///
/// JS Function Return:
/// - bool
fn js_sync_compare(mut cx: FunctionContext) -> JsResult<JsBoolean> {
    // Get the arguments
    let data = cx.argument::<JsString>(0)?.value(&mut cx);
    let hash = cx.argument::<JsString>(1)?.value(&mut cx);

    // Run the hash
    let res = bcrypt::verify(data, &hash).expect("Error occured verifying data against hash."); // TODO - Change the unwraps to error handling...

    // Return the result
    Ok(cx.boolean(res))
}

fn js_async_compare(mut cx: FunctionContext) -> JsResult<JsPromise> {
    // Get the arguments
    let data = cx.argument::<JsString>(0)?.value(&mut cx);
    let hash = cx.argument::<JsString>(1)?.value(&mut cx);

    // Run the hash
    let promise = cx
        .task(move || bcrypt::verify(data, &hash))
        .promise(move |mut cx, r| {
            let r = r.expect("Error occured verifying data against hash.");
            Ok(cx.boolean(r))
        });

    // Return the async promise
    Ok(promise)
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    // Export consts
    let min_cost = MIN_COST;
    let min_cost = cx.number(min_cost);
    cx.export_value("MIN_COST", min_cost)?;

    let max_cost = MAX_COST;
    let max_cost = cx.number(max_cost);
    cx.export_value("MAX_COST", max_cost)?;

    let default_cost = DEFAULT_COST;
    let default_cost = cx.number(default_cost);
    cx.export_value("DEFAULT_COST", default_cost)?;

    // Export functions
    cx.export_function("hashSync", js_sync_hash)?;
    cx.export_function("compareSync", js_sync_compare)?;
    cx.export_function("hash", js_async_hash)?;
    cx.export_function("compare", js_async_compare)?;
    
    // Good!
    Ok(())
}
