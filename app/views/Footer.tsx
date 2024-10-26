const Footer = () => {
  return (
    <section className="mt-20 pb-24 md:pb-4 px-4">
      <div className="mx-auto max-w-screen-xl">
        <hr className="mb-4 border-gray-200 sm:mx-auto dark:border-gray-700" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-100 sm:text-center dark:text-gray-400">
            © {new Date().getFullYear()}{" "}
            <a href="https://mohagussetiaone.vercel.app" target="_blank" className="hover:underline">
              Moh Agus Setiawan
            </a>
            . All Rights Reserved.
          </span>
        </div>
      </div>
    </section>
  );
};

export default Footer;
