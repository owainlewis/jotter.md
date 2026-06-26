import Editor from "../editor";
import { EntitlementsProvider } from "../entitlements";

export default function Write() {
  return (
    <EntitlementsProvider>
      <Editor />
    </EntitlementsProvider>
  );
}
