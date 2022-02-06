// SPDX-License-Identifier: MIT
// Nome: João Vítor Souto dos Santos
// Nome: Rafael Silva Freire
// Conta do contrato: 0x000000

// Seu contrato começa aqui!
pragma solidity ^0.8.11;

contract Gallery {
    struct Proposal {
        address payable owner;
        uint256 price;
    }

    struct ProposalImage {
        address payable owner;
        uint256 price;
        string hash;
        string name;
    }

    struct Image {
        address payable owner;
        string name;
        string hash;
        Proposal[] proposals;
    }

    event ImageUploaded(Image image);

    Image[] public images;
    address payable owner;

    constructor() {
        owner = payable(msg.sender);
    }

    function getProposalsByOwner()
        public
        view
        returns (ProposalImage[] memory)
    {
        uint256 qntProposals = 0;
        uint256 index = 0;

        for (uint256 i = 0; i < images.length; i++) {
            if (msg.sender == images[i].owner) {
                qntProposals += images[i].proposals.length;
            }
        }

        ProposalImage[] memory ownerProposals = new ProposalImage[](
            qntProposals
        );

        for (uint256 i = 0; i < images.length; i++) {
            if (msg.sender == images[i].owner) {
                for (uint256 j = 0; j < images[i].proposals.length; j++) {
                    ProposalImage memory proposal;
                    proposal.owner = images[i].proposals[j].owner;
                    proposal.price = images[i].proposals[j].price;
                    proposal.hash = images[i].hash;
                    proposal.name = images[i].name;
                    ownerProposals[index] = proposal;
                    index++;
                }
            }
        }

        return ownerProposals;
    }

    function getImages() public view returns (Image[] memory) {
        return images;
    }

    function uploadImage(string memory name, string memory hash) public {
        require(bytes(name).length > 0);
        require(bytes(hash).length > 0);
        require(msg.sender != address(0));

        for (uint256 i = 0; i < images.length; i++) {
            if (keccak256(abi.encodePacked(images[i].hash)) ==
                keccak256(abi.encodePacked(hash))) {
                require(false, "Image already exists");
            }
        }

        Image storage image = images.push();
        image.owner = payable(msg.sender);
        image.name = name;
        image.hash = hash;
        emit ImageUploaded(image);
    }

    function addProposal(string memory imageHash) public payable {
        for (uint256 i = 0; i < images.length; i++) {
            if (
                keccak256(abi.encodePacked(images[i].hash)) ==
                keccak256(abi.encodePacked(imageHash))
            ) {
                require(msg.sender != images[i].owner);
                require(msg.value > 0, "Proposal must have a positive price");

                for (uint256 j = 0; j < images[i].proposals.length; j++) {
                    require(
                        keccak256(
                            abi.encodePacked(images[i].proposals[j].owner)
                        ) != keccak256(abi.encodePacked(msg.sender)),
                        "You already sent a proposal for this image"
                    );
                }

                Proposal memory proposal = Proposal(
                    payable(msg.sender),
                    msg.value
                );
                images[i].proposals.push(proposal);

                return;
            }
        }

        require(false, "Image not found");
    }

    function removeProposal(string memory imageHash) public {
        for (uint256 i = 0; i < images.length; i++) {
            if (
                keccak256(abi.encodePacked(images[i].hash)) ==
                keccak256(abi.encodePacked(imageHash))
            ) {
                require(msg.sender != images[i].owner);

                for (uint256 j = 0; j < images[i].proposals.length; j++) {
                    if (
                        keccak256(
                            abi.encodePacked(images[i].proposals[j].owner)
                        ) == keccak256(abi.encodePacked(msg.sender))
                    ) {
                        images[i].proposals[j].owner.transfer(
                            images[i].proposals[j].price
                        );
                        images[i].proposals[j] = images[i].proposals[
                            images[i].proposals.length - 1
                        ];
                        images[i].proposals.pop();
                        return;
                    }
                }

                require(false, "Proposal not found for this image");
            }
        }

        require(false, "Image not found");
    }

    function acceptProposal(string memory imageHash, address proposalOwner)
        public
    {
        for (uint256 i = 0; i < images.length; i++) {
            if (
                keccak256(abi.encodePacked(images[i].hash)) ==
                keccak256(abi.encodePacked(imageHash))
            ) {
                require(
                    msg.sender == images[i].owner,
                    "Only the owner can accept proposals"
                );

                for (uint256 j = 0; j < images[i].proposals.length; j++) {
                    if (
                        keccak256(
                            abi.encodePacked(images[i].proposals[j].owner)
                        ) == keccak256(abi.encodePacked(proposalOwner))
                    ) {
                        payable(msg.sender).transfer(
                            images[i].proposals[j].price
                        );
                        images[i].owner = images[i].proposals[j].owner;
                        images[i].proposals[j] = images[i].proposals[
                            images[i].proposals.length - 1
                        ];
                        images[i].proposals.pop();

                        for (
                            uint256 k = 0;
                            k < images[i].proposals.length;
                            k++
                        ) {
                            images[i].proposals[k].owner.transfer(
                                images[i].proposals[k].price
                            );
                        }

                        delete images[i].proposals;

                        return;
                    }
                }

                require(false, "Proposal not found for this image");
            }
        }

        require(false, "Image not found");
    }

    function refuseProposal(string memory imageHash, address proposalOwner)
        public
    {
        for (uint256 i = 0; i < images.length; i++) {
            if (
                keccak256(abi.encodePacked(images[i].hash)) ==
                keccak256(abi.encodePacked(imageHash))
            ) {
                require(
                    msg.sender == images[i].owner,
                    "Only the owner can refuse proposals"
                );

                for (uint256 j = 0; j < images[i].proposals.length; j++) {
                    if (
                        keccak256(
                            abi.encodePacked(images[i].proposals[j].owner)
                        ) == keccak256(abi.encodePacked(proposalOwner))
                    ) {
                        images[i].proposals[j].owner.transfer(
                            images[i].proposals[j].price
                        );
                        images[i].proposals[j] = images[i].proposals[
                            images[i].proposals.length - 1
                        ];
                        images[i].proposals.pop();
                        return;
                    }
                }

                require(false, "Proposal not found for this image");
            }
        }

        require(false, "Image not found");
    }

    function destroy() public {
        require(msg.sender == owner, "Only the owner can destroy the contract");

        selfdestruct(owner);
    }
}
