// const {assert} = require('chai')
var Election = artifacts.require("./Election.sol");

contract("Election", function(accounts) {

    describe('Tests our Election contract', () => {

        it('initializes with 2 candidates', function() {
            return Election.deployed().then(function(instance) {
                return instance.candidatesCount();
            }).then(function(count) {
                assert.equal(count, 2);
            });
        });

        it('it initializes the candidates with the correct values', function() {
            return Election.deployed().then(function(instance) {
                electionInstance = instance;
                return electionInstance.candidates(1);
            }).then(function(candidate) {
                assert.equal(candidate[0], 1, 'contains the correct id');
                assert.equal(candidate[1], 'Candidate 1', 'contains the correct name');
                assert.equal(candidate[2], 0, 'contains the correct vote count');
                return electionInstance.candidates(2);
            }).then(function(candidate) {
                assert.equal(candidate[0], 2, 'contains the correct id');
                assert.equal(candidate[1], 'Candidate 2', 'contains the correct name');
                assert.equal(candidate[2], 0, 'contains the correct vote count');
            })
        })

        it("allows a voter to cast a vote", function() {
            return Election.deployed().then(function(instance) {
              electionInstance = instance;
              let candidateId = 1;
              console.log('accounts', accounts[0])
              return electionInstance.vote(candidateId, { from: accounts[0] });
            }).then(function(receipt) {
              assert.equal(receipt.logs.length, 1, "an event was triggered");
              assert.equal(receipt.logs[0].event, "votedEvent", "the event type is correct");
              assert.equal(receipt.logs[0].args._candidateId.toNumber(), candidateId, "the candidate id is correct");
              return electionInstance.voters(accounts[0]);
            }).then(function(voted) {
              assert(voted, "the voter was marked as voted");
              return electionInstance.candidates(candidateId);
            }).then(function(candidate) {
              var voteCount = candidate[2];
              assert.equal(voteCount, 1, "increments the candidate's vote count");
            })
          });
        

        
    })
    
})