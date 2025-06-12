import { auth } from "@/auth";
import ProfileForm from "@/components/profile/profile-form";
import { SessionProvider } from "next-auth/react";

export const metadata = {
  title: "My profile",
};
const MyProfilePage = async () => {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <div className="max-w-md mx-auto space-y-4">
        <h2 className="h2-bold">Profile</h2>
        <ProfileForm />
      </div>
    </SessionProvider>
  );
};

export default MyProfilePage;
