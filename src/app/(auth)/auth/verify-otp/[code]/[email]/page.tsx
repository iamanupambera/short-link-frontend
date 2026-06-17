import { VerifyOtpPage } from '@/features/auth/components/verify-otp-page';

type VerifyOtpPageProps = {
  params: Promise<{
    code: string;
    email: string;
  }>;
};

export default async function Page({ params }: VerifyOtpPageProps) {
  const { code, email } = await params;
  const decodedEmail = decodeURIComponent(email);

  return <VerifyOtpPage code={code} email={decodedEmail} />;
}
