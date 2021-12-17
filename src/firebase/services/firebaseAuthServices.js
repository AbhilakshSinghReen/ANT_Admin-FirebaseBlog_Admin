import { auth } from "../firebase";

export async function signInUserWithEmailAndPassword(
  email,
  password,
  telemetryUpdates
) {
  await auth
    .signInWithEmailAndPassword(email, password)
    .then((authUser) => telemetryUpdates.success(authUser))
    .catch((error) => telemetryUpdates.error(error));
}

export async function signOutUser() {
  await auth.signOut();
}
