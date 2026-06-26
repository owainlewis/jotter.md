import Editor from "./editor";
import { EntitlementsProvider } from "./entitlements";

export default function Home() {
  return (
    <EntitlementsProvider>
      <Editor />
    </EntitlementsProvider>
  );
}
