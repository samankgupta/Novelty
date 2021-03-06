import React from "react";
import homeimage from "../assets/images/chessbg.jpg"
import { useNavigate } from 'react-router-dom';

const Home = () => {

    const navigate = useNavigate();

    return (
        <div className="bg-bgcolor">
            <img className="ml-auto h-screen animate-pulse" src={homeimage} alt="Novelty Chess Dapp" />
            <div className="absolute top-12 left-36 ">
                <div className="pt-16 w-2/5">
                    <div className="text-left">
                        <h1 className="text-7xl font-extrabold pt-8"><span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-amber-300 filter drop-shadow hover:drop-shadow-lg">NOVELTY</span></h1><br />
                        <h1 className="mt-8 mb-4 text-2xl text-amber-400">Novelty is a Chess Dapp where both the players stake tokens of their choice at the beginning of the game and the winner takes it all.</h1>
                        <button onClick={() => navigate('/stake/')} className="text-white text-lg font-medium rounded-xl my-4 px-20 py-4 bg-gradient-to-r from-amber-600 to-amber-300 hover:from-amber-700 hover:to-amber-500 hover:shadow-2xl">Stake Tokens</button>
                        <h1 className="mt-8 mb-4 text-2xl text-amber-400">Check out the NFT Store to purchase NFTs of some of the best chess games ever!</h1>
                        <button onClick={() => navigate('/nftstore/')} className="text-white text-lg font-medium rounded-xl mt-4 px-20 py-4 bg-gradient-to-r from-amber-600 to-amber-300 hover:from-amber-700 hover:to-amber-500 hover:shadow-2xl">NFT Store</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;