import { getRallyCount, initRallyDB } from "../../lib/db";
import RallyForm from "./RallyForm";

export const revalidate = 0;

const RALLY_LIMIT = 5;

export default async function RallyPage() {
  let count = 0;
  try {
    await initRallyDB();
    count = await getRallyCount();
  } catch (e) {
    console.error(e);
  }

  return <RallyForm slotsLeft={RALLY_LIMIT - count} limit={RALLY_LIMIT} />;
}
