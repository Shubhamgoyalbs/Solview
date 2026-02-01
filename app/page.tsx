import Navbar from "@/components/Navbar";
import Body from "@/components/Body";
import Footer from "@/components/Footer";

export default function Home() {
	return (
	  <div className='dark flex flex-col max-w-7xl mx-auto min-h-screen'>
			<Navbar />
		  <Body />
		  <Footer />
	  </div>
  );
}
// card #181818 , white #fafafa, light black #151515
