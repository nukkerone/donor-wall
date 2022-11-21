import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css'

const getEthereumObject = () => (window as any).ethereum;

const findMetaMaskAcoount = async () => {
  try {
    const ethereum = getEthereumObject();

    /*
    * First make sure we have access to the Ethereum object.
    */
    if (!ethereum) {
      console.error("Make sure you have Metamask!");
      return null;
    }

    console.log("We have the Ethereum object", ethereum);
    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      return account;
    } else {
      console.error("No authorized account found");
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

const Home: NextPage = () => {
  const [currentAccount, setCurrentAccount] = useState("");

  /*
   * The passed callback function will be run when the page loads.
   * More technically, when the App component "mounts".
   */
  useEffect(() => {
    const fetchAccount = async () => {
      const account = await findMetaMaskAcoount();
      if (account !== null) {
        setCurrentAccount(account);
      }
    }

    fetchAccount();
  }, []);

  const connectWallet = async () => { 
    try {
      const ethereum = getEthereumObject();

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Donor Wall</title>
        <meta name="description" content="A wall of honor donors" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Wall of Donors
        </h1>

        {
          currentAccount && ( <h2>{ currentAccount }</h2> )
        }

        {
          !currentAccount && ( <button className={styles.connectButton} onClick={connectWallet}>Connect</button> )
        }
      </main>

    </div>
  )
}

export default Home
