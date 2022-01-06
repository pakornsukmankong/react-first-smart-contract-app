import { useCallback, useEffect, useState } from "react";
import './App.css';
import Web3 from "web3";
import detectEthereumProvider from '@metamask/detect-provider'
import {loadContract} from "./utils/load-contract";

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    isProviderLoaded: false,
    web3: null,
    contract: null,
  })

  const [balance, setBalance] = useState(null)
  const [account, setAccount] = useState(null)
  const [shouldReload, reload] = useState(false)

  const canConnectToContract = account && web3Api.contract
  const reloadEffect = useCallback(() => reload(!shouldReload),[shouldReload])

  const setAccountListener = provider => {
    provider.on("accountsChanged", _ => window.location.reload())
    provider.on("chainChanged", _ => window.location.reload())

    // provider._jsonRpcConnection.events.on("notfication", (payload) => {
    //   const {method} = payload

    //   if (method === "metamask_unlockStateChanged") {
    //     setAccount(null)
    //   }
    // })
  }

  useEffect(() => {
      const loadProvider = async () => {
      const provider = await detectEthereumProvider();

      if (provider) {
        const contract = await loadContract("Faucet", provider)
        setAccountListener(provider)
        //provider.request({method: "eth_requestAccounts"})
        setWeb3Api({
        web3: new Web3(provider),
        provider,
        contract,
        isProviderLoaded: true
      })

      } else {
        setWeb3Api(api => ({...api, isProviderLoaded:true}))
        console.error("Please, install Metamask")
      }
    }
      // if (window.ethereum) {
      //   provider = window.ethereum;

      //   try {
      //     await provider.request({method: "eth_requestAccounts"}); //call popup metamask
      //   } catch {
      //     console.error("User denied accounts access!")
      //   }
      // }
      // else if (window.web3) {
      //   provider = window.web3.currentProvider
      // }
      // else if (!process.env.production) {
      //   provider = new Web3.providers.HttpProvider("http://localhost:7545")
      // }

      // setWeb3Api({
      //   web3: new Web3(provider),
      //   provider
      // })
    

    loadProvider()
  }, [])

  useEffect(() => {
    const loadBalance = async () => {
      const {contract, web3} = web3Api
      const balance = await web3.eth.getBalance(contract.address)
      setBalance(web3.utils.fromWei(balance, "ether"))
    }
    web3Api.web3 && loadBalance()
  }, [web3Api, shouldReload])

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3Api.web3.eth.getAccounts()
      debugger
      setAccount(accounts[0])
    }
    web3Api.web3 && getAccount()
  }, [web3Api.web3])

  const addfunds =  useCallback(async () => {
    const {contract , web3} = web3Api
    await contract.addFunds({
      from: account,
      value: web3.utils.toWei("1", "ether")
    })

    //window.location.reload();
    reloadEffect()
  }, [web3Api, account, reloadEffect])

  const withdraw =  useCallback(async () => {
    const {contract , web3} = web3Api
    const withdrawAmount = web3.utils.toWei("0.1", "ether")
    await contract.withdraw(withdrawAmount,{
      from: account,
    })

    //window.location.reload();
    reloadEffect()
  }, [web3Api, account, reloadEffect])
  
  return (
  <>
    <div className="faucet-wrapper">
      <div className="faucet">
        { web3Api.isProviderLoaded ?
          <div className="is-flex is-align-items-center">
            <span>
              <strong className="mr-2">Account :</strong>
            </span>
              {
              account ? //if have account
                <div>{account}</div> : //show account
                !web3Api.provider ?//if doesn't have accounts
                <>
                  <div className="notification is-warning is-size-7 is-rounded">
                    Wallet is not detected!{` `} 
                    <a target ="_blank" rel="noreferrer" href="https://metamask.io/download.html">
                      Install Metamask
                    </a>
                  </div>
                </> :
              <button
                className="button is-small"
                onClick={() => web3Api.provider.request({method: "eth_requestAccounts"})}
              >
                Connect Wallet
              </button>
              }
          </div> :
          <span>Looking for web3...</span>
        }
        <div className="balance-view is-size-2 my-4">
          Current Balance: <strong>{balance}</strong> ETH
        </div>
        {!canConnectToContract &&
          <i className="is-block">
            Connect to Ganache
          </i>
        }
        <button 
          disabled={!canConnectToContract}
          onClick={addfunds}
          className="button is-danger mr-2">
            Donate 1 ETH</button>
        <button
        disabled={!canConnectToContract}
        onClick={withdraw}
         className="button is-primary">
            Withdraw 0.1 ETH</button>
      </div>
    </div>
  </>
  );
}

export default App;


//problem solve by using this try to remove first node_modules and package-lock.json
// then
// npm install --save react-scripts@4.0.3
// and
// npm install