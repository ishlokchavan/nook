import { NotificationBar } from '@/components/portal/notification-bar';
import { PortalHeader } from '@/components/portal/portal-header';
import { Footer } from '@/components/sections/footer';
import { LocaleProvider } from '@/components/i18n/locale-provider';
import { AuthProvider } from '@/components/portal/auth-provider';
import { getI18n } from '@/lib/i18n/server';

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const { locale, messages } = await getI18n();

  return (
    <LocaleProvider locale={locale} messages={messages}>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-paper">
          {/* Promo banner sits above the nav, per the Figma. */}
          <NotificationBar />
          <PortalHeader />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </AuthProvider>
    </LocaleProvider>
  );
}
