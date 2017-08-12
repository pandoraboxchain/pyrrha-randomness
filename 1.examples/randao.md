#Randao

https://github.com/randao/randao/blob/master/contracts/Randao.sol

https://github.com/randao/randao/blob/master/handbook.md


Получение рендома доступно после того как туда "набросают" рендомов

```javascript
function getRandom(uint256 _campaignID) noEther external returns (uint256) {
      Campaign c = campaigns[_campaignID];
      return returnRandom(c);
  }

  function returnRandom(Campaign storage c) bountyPhase(c.bnum) internal returns (uint256) {
      if (c.revealsNum == c.commitNum) {
          c.settled = true;
          return c.random;
      }
  }
```


До этого идет "накидывание" рендомов
```javascript
 function commit(uint256 _campaignID, bytes32 _hs) notBeBlank(_hs) external {
      Campaign c = campaigns[_campaignID];
      commitmentCampaign(_campaignID, _hs, c);
  }
  function commitmentCampaign(uint256 _campaignID, bytes32 _hs, Campaign storage c) checkDeposit(c.deposit) checkCommitPhase(c.bnum, c.commitBalkline, c.commitDeadline) beBlank(c.participants[msg.sender].commitment) internal {
      c.participants[msg.sender] = Participant(0, _hs, 0, false, false);
        c.commitNum++;
        Commit(_campaignID, msg.sender, _hs);
  }
```
  
##Реализация

контракт

https://etherscan.io/address/0x6C8060507273A0ff175361C6bf9F86e97f8Cf2C8#code

транзакций нет

https://etherscan.io/address/0x6C8060507273A0ff175361C6bf9F86e97f8Cf2C8