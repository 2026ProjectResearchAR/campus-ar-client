import type { Metadata } from "next";
import Link from "next/link";
import { LuCamera, LuChevronLeft, LuMapPin } from "react-icons/lu";

import { version } from "../../../../package.json";
import ClearLocalData from "./_components/ClearLocalData";
import PermissionItem from "./_components/PermissionItem";
import SettingsSection from "./_components/SettingsSection";

export const metadata: Metadata = {
  title: "設定",
  description: "位置情報・カメラの許可状況の確認や、保存データの削除ができます。",
};

/**
 * 設定ページ: 権限の案内 / 保存データの削除 / アプリ情報
 * ログイン機能がないため、ログアウトの項目は置いていない。
 */
export default function SettingsPage() {
  return (
    <div className="flex-1 px-5 pt-4 pb-[calc(var(--tabbar-h)+24px)]">
      <Link
        href="/screen/mypage"
        className="-ml-2 inline-flex h-10 items-center gap-1 pr-3 pl-1 text-[14px] font-semibold text-muted"
      >
        <LuChevronLeft size={20} strokeWidth={2.2} />
        マイページ
      </Link>

      <h1 className="mt-2 text-[22px] font-bold text-ink">設定</h1>

      <div className="mt-6 space-y-6">
        <SettingsSection title="権限">
          <PermissionItem
            kind="geolocation"
            label="位置情報"
            usage="マップに現在地を表示します"
            icon={<LuMapPin size={20} strokeWidth={2} />}
          />
          <PermissionItem
            kind="camera"
            label="カメラ"
            usage="ARマーカーのスキャンに使います"
            icon={<LuCamera size={20} strokeWidth={2} />}
          />
        </SettingsSection>

        <SettingsSection title="データ">
          <ClearLocalData />
        </SettingsSection>

        <SettingsSection title="アプリ情報">
          <div className="flex items-center justify-between p-4 text-[14px]">
            <span className="font-semibold text-ink">バージョン</span>
            <span className="text-muted">{version}</span>
          </div>
        </SettingsSection>
      </div>
    </div>
  );
}
