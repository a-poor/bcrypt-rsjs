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
fn js_hash(mut cx: FunctionContext) -> JsResult<JsString> {
    // Get the arguments
    let arg_data = cx.argument::<JsString>(0)?;
    let arg_rounds = cx.argument_opt(1);

    // Get the underlying data
    let data = arg_data.value(&mut cx);
    let mut cost = DEFAULT_COST;

    // Check if a cost was supplied (otherwise uses default)
    if let Some(arg_rounds) = arg_rounds {
        let rounds: Handle<JsNumber> = arg_rounds.downcast_or_throw(&mut cx)?;
        let n = rounds.value(&mut cx);

        // Check the value
        if n < MIN_COST.into() {
            return cx.throw_error(COST_OUT_OF_RANGE_ERR_MSG);
        }
        if n > MAX_COST.into() {
            return cx.throw_error(COST_OUT_OF_RANGE_ERR_MSG);
        }
        cost = n as u32;
    }

    // Run the hash
    let h = bcrypt::hash(
        data, 
        cost,
    ).expect("Unable to hash data.");

    // Return the result
    Ok(cx.string(h))
}

/// JS Function Arguments:
/// - password: string
/// - hash: string
///
/// JS Function Return:
/// - bool 
fn js_compare(mut cx: FunctionContext) -> JsResult<JsBoolean> {
    // Get the arguments
    let data = cx.argument::<JsString>(0)?.value(&mut cx);
    let hash = cx.argument::<JsString>(1)?.value(&mut cx);

    // Run the hash
    let res = bcrypt::verify(data, &hash).expect("Unable to verify data against hash"); // TODO - Change the unwraps to error handling...

    // Return the result
    Ok(cx.boolean(res))
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("hash", js_hash)?;
    cx.export_function("compare", js_compare)?;
    Ok(())
}
