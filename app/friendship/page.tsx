import { initFriendshipDB } from "../../lib/db";
import FriendshipForm from "./FriendshipForm";

export const revalidate = 0;

export default async function FriendshipPage() {
  try {
    await initFriendshipDB();
  } catch (e) {
    console.error("Failed to initialize friendship DB:", e);
  }

  return <FriendshipForm />;
}
