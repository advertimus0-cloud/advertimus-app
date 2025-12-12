import Image from "next/image";

export default function Footer() {
  return (
    <footer className="adv-footer">
      <div className="adv-footer-shell">
        <div className="adv-footer-col">
        <Image
  src="/Advertimus-logo.png"
  alt="Advertimus Logo"
  width={160}
  height={52}
  className="adv-footer-logo"
/>


        </div>

        <div className="adv-footer-col">
          <div className="adv-footer-h">Product</div>
          <a className="adv-footer-a">Solutions</a>
          <a className="adv-footer-a">Pricing</a>
        </div>

        <div className="adv-footer-col">
          <div className="adv-footer-h">Resources</div>
          <a className="adv-footer-a">Who is Advertimus</a>
          <a className="adv-footer-a">Advertimus IQ</a>
          <a className="adv-footer-a">Support</a>
        </div>

        <div className="adv-footer-col">
          <div className="adv-footer-h">Company</div>
          <a className="adv-footer-a">About</a>
          <a className="adv-footer-a">Legal</a>
        </div>
      </div>

      <div className="adv-footer-bottom">© {new Date().getFullYear()} Advertimus</div>
    </footer>
  );
}
