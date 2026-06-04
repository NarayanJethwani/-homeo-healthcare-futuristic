import { db } from "../src/lib/firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

async function check() {
  console.log("Checking Firestore ai_telemetry_logs...");
  const logsRef = collection(db, "ai_telemetry_logs");
  const q = query(logsRef, orderBy("timestamp", "desc"), limit(5));
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    console.log("No telemetry logs found in Firestore!");
    return;
  }
  snapshot.forEach(doc => {
    const d = doc.data();
    console.log(`Document ID: ${doc.id}`);
    console.log(`  Timestamp: ${d.timestamp}`);
    console.log(`  Task Type: ${d.taskType}`);
    console.log(`  Model:     ${d.modelUsed}`);
    console.log(`  Status:    ${d.status}`);
    console.log(`  Snippet:   ${d.promptSnippet}`);
  });
}

check().catch(console.error);
