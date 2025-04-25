import { CONFIG } from "@/lib/constants/config";
import { BadgeAlert } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t">
      <div className="p-5 flex-center flex flex-col sm:flex-row">
        <p>
          {currentYear} {CONFIG.APP_NAME}. All rights reserved.
        </p>
        <p className="flex items-center">
          <BadgeAlert className="mx-2" size="16" />
          <span className="font-semibold">Just a demo — no real orders</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
