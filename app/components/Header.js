// import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import dynamic from 'next/dynamic';

import style from "../styles/Header.module.css";

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

const Header = () => {
  return (
    <div className={style.wrapper}>
      <div className={style.title}>DAO Vote App</div>
      {/* <WalletMultiButton /> */}
      <WalletMultiButtonDynamic />
    </div>
  );
};

export default Header;
