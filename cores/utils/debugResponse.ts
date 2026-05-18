export function inspectResponse(data: any, label: string = "API Response") {
  console.log(`\n=== 🔍 [${label}] ===`);

  if (Array.isArray(data)) {
    console.log(`📌 Type: Array`);
    console.log(`📊 Row count: ${data.length}`);
    if (data.length > 0 && typeof data[0] === "object") {
      console.log(`🔑 Fields (from first row):`, Object.keys(data[0]));
    }
  } else if (data !== null && typeof data === "object") {
    console.log(`📌 Type: Object`);
    console.log(`🔑 Fields:`, Object.keys(data));
    console.log(`📄 Value:\n${JSON.stringify(data, null, 2)}`);
  } else {
    console.log(`📌 Type: ${typeof data}`);
    console.log(`📄 Value:`, data);
  }

  console.log(`=======================\n`);
}
