abi = [];
$(document).ready(async function () {
  abi = await fetch('/build/abi network/ColexionTest.json')
    .then(response => response.json())
    .then(data => {
      return data;
    });

  await loadWeb3()
  await loadBlockchainData()
});

async function loadWeb3() {
  if (window.ethereum) {
    window.web3 = await new Web3(window.ethereum)
  }
  else if (window.web3) {
    window.web3 = await new Web3(window.web3.currentProvider)
  }
  else {
    toastr.error('Non-Ethereum browser detected. You should consider trying MetaMask!.');
  }
}


async function loadBlockchainData() {
  web3 = window.web3
  account = await web3.eth.getAccounts()
  account = account[0]
  const networkId = await web3.eth.net.getId()
  console.log("networkId");
  console.log(networkId); 
  // const networkData = abi.networks[networkId]
  console.log(abi);
  // if (true) {
  //     const address = networkData.address
  //     contract = await new web3.eth.Contract(abi.abi, address)
  //     console.log(contract);
  
  if (networkId == 3) {
    // const address = networkData.address
    // contract = await new web3.eth.Contract(abi.abi, address)
    contract = await new web3.eth.Contract(abi, address)
    console.log(contract); 

  } else {
      toastr.error('Please switch to correct Network');
      return false
  }
  return true;
}



async function Token_Purchase(id, price) {

  await loadBlockchainData();

  const TokenID_Purchase = id;
  if (TokenID_Purchase == "") {
    document.getElementById("Error_Purchase").style.display = "block"
    document.getElementById("Error_Purchase_Text").innerText = "Enter Token ID..."
  }

  if (TokenID_Purchase != "") {
    account = await web3.eth.getAccounts().then((result) => {
      return result[0];
    }).catch((err) => {
      console.log(err);
    });

    price = await contract.methods.T_cost(parseInt(TokenID_Purchase)).call().then((result) => {
      return result;
    }).catch((err) => {
      console.log(err);
    });

    alert(price);

    if (account == await getSessionUser()) {
      // uint64,uint256,uint256,uint256
      var loading = new Loading({ loadingBgColor: 'rgb(77, 150, 223)', discription: "Waiting for transaction confirmation, please don't close window it will take 5-10 minutes." });
      await contract.methods.purchaseToken(parseInt(TokenID_Purchase), 33, 33, 33).send({ from: account, value: parseInt(price) })
        .then(async (result) => {
          priceInEther = parseInt(price) / 1000000000000000000;
          await fetch(`${URL}home/purchaseToken/${TokenID_Purchase}/${account}/${priceInEther}`)
            .then(response => response.json())
            .then(data => {
              toastr.success('You have purchase this token');
              window.location.replace('/profile');
              //location.href = 'http://address.com';
              //document.getElementById("Success_Purchase").style.display = "block"
              //document.getElementById("Success_Purchase_Text").innerText = "You have purchase this token"
            })
            .catch((err) => {
              console.log(err);
              loading.out();
            });
          loading.out();
        }).catch((err) => {
          toastr.warning(err.message);
          loading.out();
        });
    } else {
      toastr.error("Re-login please or you have change your Metamask account.");
      // document.getElementById("Error_Purchase").style.display = "block"
      // document.getElementById("Error_Purchase_Text").innerText = "Re-login please or you have change your Metamask account."
    }
  }
}


async function getSessionUser() {
  logUser = await fetch(`${URL}login/getUser`)
    .then(response => response.json())
    .then(data => {
      return data.userLogin;
    })
    .catch((err) => {
      console.log(err);
    });
  return logUser;
}


async function getStatus7845() {
  status = document.getElementById("token_status185").value;
  if (status == "Auctioned") {
    document.getElementById("Auction_Duration_1").style.display = "block";
    document.getElementById("Maximum_Bid_1").style.display = "block";
    document.getElementById("Minimum_Bid_1").style.display = "block";
  } else {
    document.getElementById("Auction_Duration_1").style.display = "none";
    document.getElementById("Maximum_Bid_1").style.display = "none";
    document.getElementById("Minimum_Bid_1").style.display = "none";
  }
}




async function updateStatus(id) {
  await loadBlockchainData()

  let account = await web3.eth.getAccounts();
  status  = document.getElementById("token_status185").value;
  // _status = status == "Instant_buy" ? true : false;
  
  data243 = await fetch(`${URL}profile/getData?i=${id}`)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    return data;
  })
  .catch(err => {
    toastr.error(err);
  });
  
  console.log(data243[0]);
  console.log(status);

  alert("1321321321")
  
  if ( typeof data243[0].Status != "undefined" && status == "Auctioned") {
    
    Maximum_Bid_2 = document.getElementById("Maximum_Bid_2").value;
    Minimum_Bid_2 = document.getElementById("Minimum_Bid_2").value;
    Auction_Duration_2 = document.getElementById("Auction_Duration_2").value;

    if (Maximum_Bid_2 == "" || Minimum_Bid_2 == "" || Auction_Duration_2 == "") {
      toastr.error('Fill all feilds');
      return false;
    } else {

      Maximum_Bid_InWei = await web3.utils.toWei(Maximum_Bid_2, 'ether');
      Minimum_Bid_InWei = await web3.utils.toWei(Minimum_Bid_2, 'ether');

      var loading = new Loading({ loadingBgColor: 'rgb(77, 150, 223)', discription: "Waiting for transaction confirmation, please don't close window it will take 1-2 minutes." });
      // await contract.methods.nft((parseInt(id))).call().then(async (result) => {
        // a = result;
        // if (a.Status == false) {
          await contract.methods.create_Auction(id, Maximum_Bid_InWei).send({ from: account[0] })
            .then(async (result) => {
              await contract.methods.T_Auction((parseInt(id))).call().then(async (result) => {
                a = result;

                console.log(result);
                alert("asdsadasd")
                await fetch(`${URL}update-token/Auction/${id}/${Auction_Duration_2}/${Date.now()}/0/0x0000000000000000000000000000000000000000/${Maximum_Bid_2}/Auctioned`)
                  .then(response => response.json())
                  .then(data => {
                    toastr.info('Status Updated');
                    // location.href = `${URL}profile`
                    return data;
                  })
                  .catch(err => {
                    toastr.error(err);
                  });
              })
                .catch((err) => {
                  console.log(err);
                })
            })
            .catch((err) => {
              console.log(err);
              toastr.error(err);
              location.reload()
            })
        // } else {
        //   toastr.warning("Item is on sale, should be 'Not for sale', for make auction");
        // };
        loading.out();
      // })
        // .catch((err) => {
        //   console.log(err);
        //   loading.out();
        // })
    }
  }

   console.log(data243[0].Status);
  //  console.log(_status);

  if (typeof data243[0].Status != "undefined" && data243[0].Status != status && status != "Auctioned" ) {
    var loading = new Loading({ loadingBgColor: 'rgb(77, 150, 223)', discription: "Waiting for transaction confirmation, please don't close window it will take 1-2 minutes." });

    // await contract.methods.changeStatus(parseInt(id)).send({ from: account[0] }).then(async (result) => {
      await fetch(`${URL}update-token/${id}/${status}`)
        .then(response => response.json())
        .then(data => {
          loading.out();
          location.reload()
          toastr.success("Status updated " + status);
          return data;
        })
        .catch(err => console.log(err));
    // }).catch((err) => {
    //   console.log(err);
    //   loading.out();
    // });


  } else {
    if(status != "Auctioned"){
      const asd = status == "Instant_buy" ? "On Sale" : status;
      toastr.warning("Already set to " + asd);
    }
    return true;

  }

 
}

async function updatePrice(id) {

  await loadBlockchainData()

  let account = await web3.eth.getAccounts();
  price = document.getElementById("TokenAmount8789").value;
  priceInWei = web3.utils.toWei(price, 'ether');


  var loading = new Loading({ loadingBgColor: 'rgb(77, 150, 223)', discription: "Waiting for transaction confirmation, please don't close window it will take 1-2 minutes." });
  await contract.methods.updateTokenPrice(parseInt(id), priceInWei).send({ from: account[0] }).then(async (result) => {

    await fetch(`${URL}update-token/price/${id}/${price}`)
      .then(response => response.json())
      .then(data => {
        toastr.success("Price Updated");
        return data;
      })
      .catch(err => console.log(err));
    loading.out();

  })
    .catch((err) => {
      console.log(err);
      loading.out();
    })
}

// Fazool
async function getDataNFT() {

  id = document.getElementById("getDataNFT1111").value;
  console.log(id);
  await contract.methods.nft((parseInt(id))).call().then((result) => {
    console.log(result);
  })
    .catch((err) => {
      console.log(err);
    })
}
// Fazool
async function getAuctionData(id) {
  // id = document.getElementById("auctionData").value;
  // console.log(id); 
  return await contract.methods.T_Auction((parseInt(id))).call().then((result) => {
    console.log(result);
    return result;
  })
    .catch((err) => {
      console.log(err);
    })

}
// Fazool
async function inAuction() {
  id = document.getElementById("inAuction").value;
  console.log(id);
  await contract.methods.T_In_Auction((parseInt(id))).call().then((result) => {
    console.log(result);
  })
    .catch((err) => {
      console.log(err);
    })
}
// Fazool
async function end_auction(id) {
  // id = document.getElementById("end_auction").value;
  await loadBlockchainData()
  account = await web3.eth.getAccounts()
  alert(account[0])
  console.log(id); 

  var loading = new Loading({ loadingBgColor: 'rgb(77, 150, 223)', discription: "Waiting for transaction confirmation, please don't close window it will take 1-2 minutes." });
  let auctionData = await getAuctionData(id);
  console.log(auctionData);
  console.log("auctionData.highestBid != '0' " + auctionData.h_Bid != "0");
  console.log(auctionData.h_Bidder != '0x0000000000000000000000000000000000000000' + auctionData.h_Bidder != "0x0000000000000000000000000000000000000000");
  await contract.methods.end_auction((parseInt(id))).send({ from: account[0] })
    .then(async (result) => {
      console.log(result);
      
      console.log(auctionData);

      alert(1)
      // return true
      if ( auctionData.h_Bidder != "0x0000000000000000000000000000000000000000") {
          alert("if")
        auction_win_bid = parseFloat(auctionData.h_Bid) / 1000000000000000000
        maximunBid = parseFloat(auctionData.maximunBid) / 1000000000000000000
        console.log(auction_win_bid);
        console.log(maximunBid);
        // minimunBid = parseFloat(auctionData.minimunBid) / 1000000000000000000
        alert(88)
        // return true;
        // alert("111")
        await fetch(`${URL}detail/end-auction?Token_id=${auctionData.T_id}&&auction_end=${Date.now()}&&auction_winner=${auctionData.h_Bidder}&&highestBid=${auction_win_bid}&&highestBidder=${auctionData.h_Bidder}&&maximunBid=${maximunBid}&&state=${auctionData.status}`)
        .then(response => response.json())
        .then(async (data) => {
          alert("IF API")
            console.log(data);
            location.reload();
          })
          .catch(err => console.log(err))      
      } else {
        alert("else")
        // await contract.methods.changeStatus(parseInt(id)).send({ from: account[0] }).then(async (result) => {
          await fetch(`${URL}update-token/${auctionData.T_id}/Not for Sale`)
            .then(response => response.json())
            .then(data => {
              alert("ELSE API")

              loading.out();
              // location.reload()
              toastr.success("Status updated " + status);
              return data;
            })
            .catch(err => console.log(err));
    
      }

      loading.out();
    
    
    
    
    
    }).catch((err) => {
      console.log(err);
      loading.out();
    });

  // await contract.methods.end_auction(( parseInt(id) )).send({ from: account[0] }).then((result) => {
  //   console.log(result);
  // })
  // .catch((err) => {
  //   console.log(err);
  // })
}

async function PlaceBid(id) {

  await loadBlockchainData();

  account = await web3.eth.getAccounts();
  placeBid = document.getElementById("placeBid").value;
  placeBid_InWei = web3.utils.toWei(placeBid, 'ether');

  var loading = new Loading({ loadingBgColor: 'rgb(77, 150, 223)', discription: "Waiting for transaction confirmation, please don't close window it will take 1-2 minutes." });
  await contract.methods.bid(parseInt(id)).send({ from: account[0], value: placeBid_InWei })
    .then(async (result) => {
      loading.out();
      let auctionData = await getAuctionData(id);
      console.log(auctionData);

      // currentBid = await contract.methods.bids(id, account[0]).call().then((result) => {
      //   return result;
      // }).catch((err) => {
      //   console.log(err);
      //   loading.out();
      // });

      highestBid_InEther = parseFloat(auctionData.h_Bid) / 1000000000000000000;
      // auction_win_bid = parseFloat(auctionData.auction_win_bid) / 1000000000000000000;
      maximunBid_InEther = parseFloat(auctionData.maximunBid) / 1000000000000000000;
      // minimunBid_InEther = parseFloat(auctionData.minimunBid) / 1000000000000000000;


      if (auctionData.status == true || auctionData.status == "true") {
        await fetch(`${URL}detail/place-bid/${id}/${highestBid_InEther}/${auctionData.h_Bidder}`)
          .then(response => response.json())
          .then(async (data) => {
            // console.log(data);
            // alert("Bid placed")
            location.reload();
          })
          .catch(err => {
            console.log(err)
            loading.out();
          })
      }
      else {
        await fetch(`${URL}detail/end-auction?Token_id=${auctionData.T_id}&&auction_end=${Date.now()}&&auction_win_bid=${auctionData.h_Bid}&&auction_winner=${auctionData.h_Bidder}&&highestBid=${highestBid_InEther}&&highestBidder=${auctionData.h_Bidder}&&maximunBid=${maximunBid_InEther}&&state=${auctionData.status}`)
          .then(response => response.json())
          .then(async (data) => {
            // console.log(data);
            location.reload();
          })
          .catch(err => {
            console.log(err)
            loading.out();
          })
      }
      loading.out();

    }).catch((err) => {
      console.log(err);
      loading.out();
    });
}

async function bidsInfo(id) {
  // bidsID = document.getElementById("bidsID").value;
  // bidsAddress = document.getElementById("bidsAddress").value;

  await loadBlockchainData();

  account = await web3.eth.getAccounts()
  await contract.methods.T_Auction(id).call().then((result) => {
    // console.log(result);
  }).catch((err) => {
    console.log(err);
  });

  await contract.methods.bids(id, account[0]).call().then((result) => {
    // console.log(result);
    document.getElementById("myBids").style.display = "block";
    document.getElementById("myBids").innerHTML = `Your total bid of this Auction is <strong>${result / 1000000000000000000}</strong> &nbsp; <img src="https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg" width="15px" alt="Eth-logo"> `;
  }).catch((err) => {
    console.log(err);
  });
}

async function withdrawNow(event) {
  console.log("id => " + event.target.nextElementSibling.firstElementChild.innerText);
  id = event.target.nextElementSibling.firstElementChild.innerText;

  await loadBlockchainData();
  account = await web3.eth.getAccounts()

  bidPrice = await contract.methods.bids(id, account[0]).call().then((result) => {
    // console.log(result);
    return result;
  }).catch((err) => {
    console.log(err);
  });

  var loading = new Loading({ loadingBgColor: 'rgb(77, 150, 223)', discription: "Waiting for transaction confirmation, please don't close window it will take 1-2 minutes." });
  await contract.methods.withdraw(id).send({ from: account[0] })
    .then(async (result) => {
      // console.log(result);

      await fetch(`${URL}detail/withdraw/${id}/${bidPrice}`)
        .then(response => response.json())
        .then(async (data) => {
          // console.log(data);
          location.reload();
        })
        .catch(err => console.log(err))
      loading.out();
    }).catch((err) => {
      loading.out();

      console.log(err);
    });
}


// --------------------------------------------------------------------------------------------------------- //
// -----     -----     -----     -----     -----     -----     -----     -----     -----     -----     ----- //
// --------------------------------------------------------------------------------------------------------- //


