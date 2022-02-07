<h1 align="center">🖼️ IMD Gallery - Post, sell and buy your favorite images!</h1>

## :tada: Overview

IMD Gallery is a Dapp which you can upload your favorite images or gifs! Also it's possible to receive and send proposals for selling and buying other cool images!

> The contract is currently deployed on the Ropsten network by the following address https://ropsten.etherscan.io/address/0x9E078841eDcdAF7DE32100e95Cc23887Dea21CEE

## :zap: Techs

The following technologies were used to build this project:

- [ReactJS](https://reactjs.org/)
- [Next.js](https://nextjs.org/)
- [web3.js](https://github.com/ChainSafe/web3.js)
- [react-ethers](https://github.com/RaphaelHardFork/react-ethers)
- [IPFS](https://ipfs.io/)
- [Chakra UI](https://chakra-ui.com/)

## :bulb: Usage

To run this project you will need to have [Node.js v14+](https://nodejs.org/en/), [Yarn](https://yarnpkg.com/), [Truffle](https://trufflesuite.com/), [Ganache](https://trufflesuite.com/ganache/) and [Git](https://git-scm.com/) installed on your computer.

1. From your terminal, run:

   ```bash
   # Clone this repo
   $ git clone https://github.com/JoaoVSouto/imd-gallery.git

   # Go into app's folder
   $ cd imd-gallery/
   ```

2. Install Truffle CLI globally running the following command:
   ```bash
   $ npm install -g truffle
   ```
3. Create a new test blockchain on Ganache and copy its RPC server host and port to `truffle-config.js` development network object
4. Deploy the Gallery contract into the Ganache blockchain by running:
   ```bash
   $ truffle migrate --reset
   ```
5. Set up the Ganache network on Metamask
6. Finally, from your terminal, run:

   ```bash
   # Install dependencies
   $ yarn

   # Start the app server
   $ yarn dev
   ```

If you don't want to have the app in your machine and **just want to see it working** simply go to [https://imd-gallery.vercel.app/](https://imd-gallery.vercel.app/).

## Contributors ✨

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/JoaoVSouto">
        <img
          src="https://avatars.githubusercontent.com/u/42191629?v=3?s=100"
          width="100px;"
          alt=""
        />
        <br />
        <sub>
          <b>João Vítor Souto dos Santos</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/rafasfz">
        <img
          src="https://avatars.githubusercontent.com/u/31613570??v=3?s=100"
          width="100px;"
          alt=""
        />
        <br />
        <sub>
          <b>Rafael Silva Freire</b>
        </sub>
      </a>
    </td>
  </tr>
</table>

## :page_facing_up: License

This project is under the MIT license. See the [LICENSE](https://github.com/JoaoVSouto/imd-gallery/blob/main/LICENSE) for more information.
