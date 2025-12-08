// app/components/Footer.jsx

export default function Footer() {
  return (
    <footer className="adv-footer">
      <div className="adv-container adv-footer-inner">
        <div className="adv-footer-left">
          {/* NOTE: تقدر تغيّر اسم البراند في الفوتر من هون */}
          <span className="adv-footer-logo">ADVERTIMUS</span>
          <span className="adv-footer-copy">
            © {new Date().getFullYear()} Advertimus. All rights reserved.
          </span>
        </div>

        <div className="adv-footer-links">
          {/* NOTE: روابط الفوتر – عدل أو احذف براحتك */}
          <a href="#" className="adv-footer-link">
            Privacy
          </a>
          <a href="#" className="adv-footer-link">
            Terms
          </a>
          <a href="#" className="adv-footer-link">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
