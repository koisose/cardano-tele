
export const dynamic = 'force-dynamic'

export const fetchCache = 'force-no-store'
import { Bot, webhookCallback, InlineKeyboard } from 'grammy'
import { marked } from 'marked';
import { askTool, ask,askGemini } from '~~/apa/gaianet';
import { LivingKnowledgeTools } from '~~/apa/livingknowledge';
import { braveSearch } from '~~/apa/brave';
import ky from 'ky'
//@ts-ignore
import { convert } from 'html-to-text';
//@ts-ignore
import showdown from 'showdown'
//@ts-ignore
import sanitizeHtml from 'sanitize-html';
const token = process.env.CARDANOAI_BOT
function truncateToBytes(str:any, byteLimit:any) {
    let truncatedStr = '';
    let byteCount = 0;

    for (let i = 0; i < str.length; i++) {
        const char = str.charAt(i);
        const charBytes = Buffer.byteLength(char, 'utf8'); // Get byte size of the character

        if (byteCount + charBytes > byteLimit) {
            break; // Stop if adding the character would exceed the byte limit
        }

        truncatedStr += char;
        byteCount += charBytes;
    }

    return truncatedStr;
}
const cleanHtml = (input: any) => {
    return sanitizeHtml(input, {
        allowedTags: ['b', 'i', 'u', 's', 'code', 'pre', 'a'], // Telegram supported tags
        allowedAttributes: {
            'a': ['href']  // Only allow href attribute for anchor tags
        },
        allowedSchemes: ['http', 'https']  // Allow only HTTP/HTTPS links
    });
};
if (!token) throw new Error('TELEGRAM_BOT_TOKEN environment variable not found.')
async function getTextFromWebpage(url: string) {
    try {
        // Fetch the text content of the webpage
        const response = await ky.get(url).text();


        // Extract only the text, without any HTML tags
        const textContent = convert(response, {
            wordwrap: false,  // Keeps long words from being broken
            ignoreHref: true, // Optional: Ignore anchor links
            ignoreImage: true // Optional: Ignore image tags
        });;

        // Log the plain text content
        return textContent.trim();

    } catch (error) {
        console.error('Error fetching webpage:', error);
        return url

    }
}
//@ts-ignore
let finish = []
const bot = new Bot(token)
bot.command("start", async (ctx) => {
       //@ts-ignore
       if (!finish.includes(ctx.msgId)) {
        finish.push(ctx.msgId)
    } else {
        console.log("already answered")
        return
    }
    return ctx.reply("WELCOME TO CARDANO DAO NMKR AI DOCS search");
});
function handleTimeout() {
    // Define your custom timeout handling logic here
    console.error('A request timed out.');
}

bot.on('message', async (ctx) => {
    //@ts-ignore
    if (!finish.includes(ctx.msgId)) {
        finish.push(ctx.msgId)
    } else {
        console.log("already answered")
        return
    }


    const messageText = ctx.message.text;
    
    ctx.reply("picking topic")
    
     const topicPicker=await askGemini(messageText as string,`you're a topic picker you gonna pick from a list of topic based on a question for example
        this is the list of topic:
   * Welcome to NMKR Docs [/]
 * Introduction
   * About NMKR [/introduction/about-nmkr]
   * Powered by NMKR [/introduction/powered-by-nmkr]
   * What is an NFT? [/introduction/what-is-an-nft]
      * What is IPFS? [/introduction/what-is-an-nft/what-is-ipfs]

   * Why Cardano? [/introduction/why-cardano]
 * NMKR Studio
   * Introduction - NMKR Studio [/nmkr-studio/introduction-nmkr-studio]
   * Features Overview [/nmkr-studio/features-overview]
   * 🖥️Learn NMKR Studio in 3 minutes [/nmkr-studio/learn-nmkr-studio-in-3-minutes]
      * Basic Workflow [/nmkr-studio/learn-nmkr-studio-in-3-minutes/basic-workflow]

   * How to - Quick Start Tutorials [/nmkr-studio/how-to-quick-start-tutorials]
      * Quickstart Full Video Tutorial [/nmkr-studio/how-to-quick-start-tutorials/quickstart-full-video-tutorial]
      * Guidelines Planning a Project [/nmkr-studio/how-to-quick-start-tutorials/guidelines-planning-a-project] 
      * How To Add Tokens [/nmkr-studio/how-to-quick-start-tutorials/how-to-add-tokens]
      * How to set up Metadata [/nmkr-studio/how-to-quick-start-tutorials/how-to-set-up-metadata]
      * How To Sell Tokens [/nmkr-studio/how-to-quick-start-tutorials/how-to-sell-tokens]
      * How To Set Up Sales Conditions [/nmkr-studio/how-to-quick-start-tutorials/how-to-set-up-sales-conditions]
      * How To Do a Reveal [/nmkr-studio/how-to-quick-start-tutorials/how-to-do-a-reveal]
      * How To Burn Tokens [/nmkr-studio/how-to-quick-start-tutorials/how-to-burn-tokens]
      * How To Enable Royalties [/nmkr-studio/how-to-quick-start-tutorials/how-to-enable-royalties]
      * How To Enable DIDs [/nmkr-studio/how-to-quick-start-tutorials/how-to-enable-dids]
      * How To Set up Whitelisting [/nmkr-studio/how-to-quick-start-tutorials/how-to-set-up-whitelisting]       
      * How to Airdrop Tokens [/nmkr-studio/how-to-quick-start-tutorials/how-to-airdrop-tokens]

   * Pricing [/nmkr-studio/pricing]
   * Account [/nmkr-studio/account]
      * Registration & KYC [/nmkr-studio/account/registration-and-kyc]
      * Security [/nmkr-studio/account/security]
      * Wallets [/nmkr-studio/account/wallets]
      * Mint Coupons [/nmkr-studio/account/mint-coupons]
      * Dashboard [/nmkr-studio/account/dashboard]
      * Transactions [/nmkr-studio/account/transactions]
      * Invoices [/nmkr-studio/account/invoices]
      * API Keys [/nmkr-studio/account/api-keys]

   * Project [/nmkr-studio/project]
      * Policy [/nmkr-studio/project/policy]
         * Managing policies [/nmkr-studio/project/policy/managing-policies]

      * Create [/nmkr-studio/project/create]
      * Edit [/nmkr-studio/project/edit]
      * Metadata Template [/nmkr-studio/project/metadata-template]
      * Statistics [/nmkr-studio/project/statistics]
      * DID - Decentralized Identifier [/nmkr-studio/project/did-decentralized-identifier]
      * Notifications [/nmkr-studio/project/notifications]
      * Royalties [/nmkr-studio/project/royalties]
      * Additional Payout Wallets [/nmkr-studio/project/additional-payout-wallets]
      * Export Metadata as Zip [/nmkr-studio/project/export-metadata-as-zip]
      * Export NFT as csv [/nmkr-studio/project/export-nft-as-csv]
      * Mint and Send Jobs [/nmkr-studio/project/mint-and-send-jobs]
      * Export placeholder.csv [/nmkr-studio/project/export-placeholder.csv]

   * Token [/nmkr-studio/token]
      * Manage Tokens Tab [/nmkr-studio/token/manage-tokens-tab]
      * Upload [/nmkr-studio/token/upload]
         * Upload single tokens [/nmkr-studio/token/upload/upload-single-tokens]
         * Bulk Upload Files and Metadata [/nmkr-studio/token/upload/bulk-upload-files-and-metadata]
            * Bulk Upload via Drag and Drop [/nmkr-studio/token/upload/bulk-upload-files-and-metadata/bulk-upload-via-drag-and-drop]
            * Bulk upload via SFTP [/nmkr-studio/token/upload/bulk-upload-files-and-metadata/bulk-upload-via-sftp]

      * Edit [/nmkr-studio/token/edit]
      * Metadata [/nmkr-studio/token/metadata]
         * Add Token-specific Metadata [/nmkr-studio/token/metadata/add-token-specific-metadata]
         * Fingerprint (Metadata preview) [/nmkr-studio/token/metadata/fingerprint-metadata-preview]
         * Metadata Check [/nmkr-studio/token/metadata/metadata-check]
         * Metadata Standard for fungible Tokens [/nmkr-studio/token/metadata/metadata-standard-for-fungible-tokens]
         * Fully on-Chain NFTs [/nmkr-studio/token/metadata/fully-on-chain-nfts]
            * Partial URL-Encoding [/nmkr-studio/token/metadata/fully-on-chain-nfts/partial-url-encoding]       

         * CIP-68 [/nmkr-studio/token/metadata/cip-68]

      * Duplicate [/nmkr-studio/token/duplicate]
      * Delete [/nmkr-studio/token/delete]
      * Burn [/nmkr-studio/token/burn]
      * Update (Edit after Mint / Reveal) [/nmkr-studio/token/update-edit-after-mint-reveal]

   * Set up Sales [/nmkr-studio/set-up-sales]
      * Manage prices / Pricelist [/nmkr-studio/set-up-sales/manage-prices-pricelist]
         * Create new Prices [/nmkr-studio/set-up-sales/manage-prices-pricelist/create-new-prices]
         * Free Drops [/nmkr-studio/set-up-sales/manage-prices-pricelist/free-drops]
         * Custom Token payment [/nmkr-studio/set-up-sales/manage-prices-pricelist/custom-token-payment]        
         * Discounts [/nmkr-studio/set-up-sales/manage-prices-pricelist/discounts]

      * Sales Conditions & Whitelisting [/nmkr-studio/set-up-sales/sales-conditions-and-whitelisting]
         * Sales conditions depending on policy ID or stake pool [/nmkr-studio/set-up-sales/sales-conditions-and-whitelisting/sales-conditions-depending-on-policy-id-or-stake-pool]
         * Whitelist with Count [/nmkr-studio/set-up-sales/sales-conditions-and-whitelisting/whitelist-with-count]
         * Blacklist [/nmkr-studio/set-up-sales/sales-conditions-and-whitelisting/blacklist]
         * Test Sales Condition [/nmkr-studio/set-up-sales/sales-conditions-and-whitelisting/test-sales-condition]

      * Block Tokens [/nmkr-studio/set-up-sales/block-tokens]
      * NMKR Pay [/nmkr-studio/set-up-sales/nmkr-pay]
         * Set up NMKR Pay [/nmkr-studio/set-up-sales/nmkr-pay/set-up-nmkr-pay]
         * MultiSig Payment [/nmkr-studio/set-up-sales/nmkr-pay/multisig-payment]
         * Website Integration [/nmkr-studio/set-up-sales/nmkr-pay/website-integration]
         * Specific Payment Links [/nmkr-studio/set-up-sales/nmkr-pay/specific-payment-links]
         * Manual sending in NMKR Pay [/nmkr-studio/set-up-sales/nmkr-pay/manual-sending-in-nmkr-pay]
         * FIAT ETH and SOL Payment [/nmkr-studio/set-up-sales/nmkr-pay/fiat-eth-and-sol-payment]

      * Pay-In Address [/nmkr-studio/set-up-sales/pay-in-address]
      * Auction [/nmkr-studio/set-up-sales/auction]

   * Minting [/nmkr-studio/minting]
      * Minting on Demand [/nmkr-studio/minting/minting-on-demand]
      * Manual Minting [/nmkr-studio/minting/manual-minting]
      * Airdropper [/nmkr-studio/minting/airdropper]
         * Airdrop with random distribution [/nmkr-studio/minting/airdropper/airdrop-with-random-distribution]  
         * Airdrop with specific distribution [/nmkr-studio/minting/airdropper/airdrop-with-specific-distribution]

   * Tools [/nmkr-studio/tools]
      * Managed Wallets [/nmkr-studio/tools/managed-wallets]
      * Split Addresses [/nmkr-studio/tools/split-addresses]
      * Direct Sales [/nmkr-studio/tools/direct-sales]
      * Policy Snapshot [/nmkr-studio/tools/policy-snapshot]
      * Integrations & Plugins [/nmkr-studio/tools/integrations-and-plugins]
         * NFT Pal [/nmkr-studio/tools/integrations-and-plugins/nft-pal]
         * Zapier [/nmkr-studio/tools/integrations-and-plugins/zapier]

   * Testnet [/nmkr-studio/testnet]
      * Create Testnet Account [/nmkr-studio/testnet/create-testnet-account]
      * Testnet Wallet & tADA [/nmkr-studio/testnet/testnet-wallet-and-tada]
      * Testnet API Swagger [/nmkr-studio/testnet/testnet-api-swagger]
 * NMKR Studio API
   * Introduction - NMKR Studio API [/nmkr-studio-api/introduction-nmkr-studio-api]
   * API Features [/nmkr-studio-api/api-features]
   * Swagger API Endpoints [https://studio-api.nmkr.io/swagger/index.html]
   * Get started with the API [/nmkr-studio-api/get-started-with-the-api]
   * API Swagger [/nmkr-studio-api/api-swagger]
      * Get Started with the Swagger [/nmkr-studio-api/api-swagger/get-started-with-the-swagger]
      * Swagger Responses and Error Codes [/nmkr-studio-api/api-swagger/swagger-responses-and-error-codes]      

   * API Examples [/nmkr-studio-api/api-examples]
      * Project [/nmkr-studio-api/api-examples/project]
         * Create Project [/nmkr-studio-api/api-examples/project/create-project]
         * Upload File and Metadata [/nmkr-studio-api/api-examples/project/upload-file-and-metadata]

      * Payment [/nmkr-studio-api/api-examples/payment]
         * Create unique NMKR Pay Link for random Token sales [/nmkr-studio-api/api-examples/payment/create-unique-nmkr-pay-link-for-random-token-sales]
         * Create NMKR Pay Link for specific Token sales [/nmkr-studio-api/api-examples/payment/create-nmkr-pay-link-for-specific-token-sales]
         * Get Payment Address for single NFT sales with native Tokens [/nmkr-studio-api/api-examples/payment/get-payment-address-for-single-nft-sales-with-native-tokens]
         * Create NMKR Pay Link for a multi-specific Tokens sale [/nmkr-studio-api/api-examples/payment/create-nmkr-pay-link-for-a-multi-specific-tokens-sale]

      * Minting [/nmkr-studio-api/api-examples/minting]
         * Manual Minting [/nmkr-studio-api/api-examples/minting/manual-minting]

      * Smart Contract [/nmkr-studio-api/api-examples/smart-contract]
         * Secondary Sales via NMKR Pay [/nmkr-studio-api/api-examples/smart-contract/secondary-sales-via-nmkr-pay]

   * API Open Source Contributions [/nmkr-studio-api/api-open-source-contributions]
 * NMKR Mint
   * Introduction - NMKR Mint [/nmkr-mint/introduction-nmkr-mint]
   * Mint single NFTs [/nmkr-mint/mint-single-nfts]
   * Mint Collection [/nmkr-mint/mint-collection]
 * NMKR Playground
   * Introduction - NMKR Playground [/nmkr-playground/introduction-nmkr-playground]
   * ADA Payment Link [/nmkr-playground/ada-payment-link]
   * Paperwallet [/nmkr-playground/paperwallet]
 * NMKR Pool
   * What is Staking? [/nmkr-pool/what-is-staking]
   * Stake with NMKR Pool [/nmkr-pool/stake-with-nmkr-pool]
 * Helpful Links
   * Cardano NFT Ressources [/helpful-links/cardano-nft-ressources]
   * Cardano Resources [/helpful-links/cardano-resources]
   * Cardano Wallets [/helpful-links/cardano-wallets]
   * Open Source Repositories [/helpful-links/open-source-repositories]
   * Security Practices [/helpful-links/security-practices]
   * Deal with Bots [/helpful-links/deal-with-bots]
   From this topic only answer the \`[]\` no explanation necessary for example i ask "what is nmkr" you will only answer '[/introduction/about-nmkr]'
        `)
        const str = topicPicker;
const trimmedStr = str.replace(/[\[\]]/g, '');
    // console.log(systemMessage)
    // https://starknetjs.com/docs/guides/intro
    const web=await getTextFromWebpage(`https://docs.nmkr.io${trimmedStr}`)
    ctx.reply("answering based on data from documentation...")
const theAnswer= await askGemini(`based on this data \`\`\`${web as string}\`\`\` what is the answer to this question \`${messageText as string}\``,"answer the question based on the data as detailed as possible, make your answer in markdown")
const html = marked(theAnswer);
const cleanString = removeHtmlTags(html as string);
// console.log(html);    
  return ctx.reply(`${decodeHtmlEntity(cleanString) as string}\n reference: https://docs.nmkr.io${trimmedStr}`)
  
})
function removeHtmlTags(str:string) {
    return str.replace(/<[^>]*>/g, '');
  }
  function decodeHtmlEntity(str:any) {
    return str.replace(/&#(\d+);/g, (match:any, dec:any) => String.fromCharCode(dec));
  }

bot.catch((err) => {
    const ctx = err.ctx;
    console.log(ctx)
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    return ctx.reply(`error please search again}`)
});

export const POST = webhookCallback(bot, 'std/http', {
    onTimeout: handleTimeout,
    timeoutMilliseconds: 60000,  // Set timeout to 60 seconds
})