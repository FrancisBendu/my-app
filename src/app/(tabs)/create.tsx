import { Redirect } from 'expo-router';

// The "+" tab opens the create sheet instead of navigating here.
// This route only exists so the tab bar has a slot; send any deep link home.
export default function CreateRoute() {
  return <Redirect href="/" />;
}
