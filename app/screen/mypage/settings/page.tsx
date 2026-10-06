import Link from "next/link";
import { LuCamera, LuChevronLeft, LuMapPin } from "react-icons/lu";
import pkg from "../../../../package.json";
import ClearLocalData from "./_components/ClearLocalData";
import PermissionItem from "./_components/PermissionItem";
import SettingsSection from "./_components/SettingsSection";

/** 設定ページ: 権限の案内 / ローカルデータ削除 / アプリ情報 / ログアウト(未実装) */
export default function SettingsPage() {
  return (
    <div className="relative flex-1 overflow-hidden pt-[66px]">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[100px] -top-[88px] h-[330px] w-[541px] rotate-12 rounded-[50%] bg-brand/10"
      />

      <div className="relative px-[27px] pb-[140px]">
        <div className="flex items-center gap-2">
          <Link
            href="/screen/mypage"
            aria-label="マイページに戻る"
            className="-ml-2 p-2 text-ink"
          >
            <LuChevronLeft size={28} strokeWidth={2.5} />
          </Link>
          <h1 className="text-[28px] font-medium text-black">設定</h1>
        </div>

        <div className="mt-8 space-y-7">
          <SettingsSection title="権限">
            <PermissionItem
              kind="geolocation"
              label="位置情報"
              icon={<LuMapPin size={25} strokeWidth={2} />}
            />
            <hr className="border-hairline" />
            <PermissionItem
              kind="camera"
              label="カメラ"
              icon={<LuCamera size={25} strokeWidth={2} />}
            />
          </SettingsSection>

          <SettingsSection title="データ">
            <ClearLocalData />
          </SettingsSection>

          <SettingsSection title="アプリ情報">
            <div className="flex justify-between text-[14px]">
              <span className="font-semibold text-black">バージョン</span>
              <span className="text-black/60">{pkg.version}</span>
            </div>
          </SettingsSection>

          <SettingsSection title="アカウント">
            <button
              type="button"
              disabled
              className="h-[40px] w-full rounded-[12px] border border-hairline bg-gray-100 text-[14px] font-semibold text-black/40"
            >
              ログアウト
            </button>
            <p className="text-[12px] text-black/60">
              ログイン機能は未実装のため、現在は利用できません。
            </p>
          </SettingsSection>
        </div>
      </div>
    </div>
  );
}
