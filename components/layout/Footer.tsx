import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="mt-20 rounded-lg bg-blue-300 text-white">
      <div className="grid grid-cols-1 gap-8 p-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <div>
          <h3 className="mb-4 text-xl font-semibold">CUSTOMER CARE</h3>
          <div className="text-sm">
            <a href="#" className="mb-2 block">
              Help Center
            </a>
            <a href="#" className="mb-2 block">
              Contact
            </a>
            <a href="#" className="mb-2 block">
              Partner
            </a>
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-xl font-semibold">INTRODUCE</h3>
          <div className="text-sm">
            <a href="#" className="mb-2 block">
              Introduce
            </a>
            <a href="#" className="mb-2 block">
              Terms of use
            </a>
            <a href="#" className="mb-2 block">
              Privacy Policy
            </a>
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-xl font-semibold">NAVIGATE</h3>
          <div className="text-sm">
            <Link
              href="/hotel/new"
              className="mb-2 flex items-center hover:underline"
            >
              Add hotel
            </Link>
            <Link
              href="/my-bookings"
              className="mb-2 flex items-center hover:underline"
            >
              My bookings
            </Link>
            <Link
              href="/my-hotels"
              className="mb-2 flex items-center hover:underline"
            >
              My hotels
            </Link>
            {/* <Link
              href="/about-us"
              className="mb-2 flex items-center hover:underline"
            >
              About
            </Link>
            <Link href="/" className="mb-2 flex items-center hover:underline">
              Contact
            </Link> */}
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-xl font-semibold">FOLLOWING</h3>
          <div className="text-sm flex flex-col">
            <a href="#" className="mb-2 items-center">
              <FontAwesomeIcon className="mr-2 text-lg" icon={faFacebook} />
              Facebook
            </a>
            <a href="#" className="mb-2 items-center">
              <FontAwesomeIcon className="mr-2 text-lg" icon={faInstagram} />
              Instagram
            </a>
            <a href="#" className="mb-2 items-center">
              <FontAwesomeIcon className="mr-2 text-lg" icon={faTiktok} />
              Tiktok
            </a>
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-xl font-semibold">ADDRESS</h3>
          <div className="text-sm">
            <p className="mb-2">36/1, District 1, City. Ho Chi Minh</p>
            <p className="mb-2">0968 462 513</p>
            <p className="mb-2">booking@gmail.com</p>
          </div>
        </div>
      </div>
      <div className="mt-8 flex grid items-center justify-around border-t-4 border-white p-4 sm:grid-cols-1 lg:grid-cols-2">
        <p className="mb-4">
          Copyright © 1986–2026 booking.id.vn™. All rights reserved.
        </p>
        <div className="">
          <h3 className="text-2xl">BOOKING HOTEL</h3>
        </div>
      </div>
    </div>
  );
};

export default Footer;
