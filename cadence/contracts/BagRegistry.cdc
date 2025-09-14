access(all) contract BagRegistry {

    /* --- Entitlements --- */
    access(all) entitlement RegistryAccess
    
    /* --- Events --- */
    access(all) event HolderRegistered(bagId: UInt64, holder: Address)
    access(all) event HolderUnregistered(bagId: UInt64, holder: Address)
    access(all) event RegistryInitialized()
    
    /* --- Storage Paths --- */
    access(all) let RegistryStoragePath: StoragePath
    
    /* --- Registry Resource --- */
    access(all) resource Registry {

        access(all) var bagHolderMapping: {UInt64: Address}  
        
        access(RegistryAccess) fun registerHolder(bagId: UInt64, holder: Address) {
            self.bagHolderMapping[bagId] = holder
            emit HolderRegistered(bagId: bagId, holder: holder)
        }
        
        access(RegistryAccess) fun unregisterHolder(bagId: UInt64, holder: Address) {
            let _ = self.bagHolderMapping.remove(key: bagId)
            emit HolderUnregistered(bagId: bagId, holder: holder)
        }
        
        // Get current holder for a specific bag ID
        access(all) view fun getHolderForBag(bagId: UInt64): Address? {
            return self.bagHolderMapping[bagId]
        }
        
        // Check if an address holds a specific bag
        access(all) view fun isHolderOfBag(bagId: UInt64, holder: Address): Bool {
            return self.bagHolderMapping[bagId] == holder
        }
        
        // Get all registered bag IDs
        access(all) view fun getAllBags(): [UInt64] {
            return self.bagHolderMapping.keys
        }

        // Get all registered bag holders
        access(all) view fun getAllBagsHolders(): [Address] {
            return self.bagHolderMapping.values
        }

        init(){
            self.bagHolderMapping = {}
        }
    }
    
    /* --- Internal Functions --- */
    access(self) fun borrowRegistry(): auth(RegistryAccess) &Registry {
        return self.account.storage.borrow<auth(RegistryAccess) &Registry>(from: self.RegistryStoragePath)
            ?? panic("Registry not found")
    }
    
    access(self) fun borrowPublicRegistry(): &Registry {
        return self.account.storage.borrow<&Registry>(from: self.RegistryStoragePath)
            ?? panic("Registry not found")
    }
    
    access(all) fun onNFTDeposited(bagId: UInt64, to: Address) {
        let registry = self.borrowRegistry()
        registry.registerHolder(bagId: bagId, holder: to)
    }
    
    access(all) fun onNFTWithdrawn(bagId: UInt64, from: Address) {
        let registry = self.borrowRegistry()
        registry.unregisterHolder(bagId: bagId, holder: from)
    }
    
    /* --- View Functions --- */
    
    // Get current holder for a specific bag ID
    access(all) fun getHolder(bagId: UInt64): Address? {
        return self.borrowPublicRegistry().getHolderForBag(bagId: bagId)
    }
    
    // Check if an address holds a specific bag
    access(all) fun isHolder(bagId: UInt64, holder: Address): Bool {
        return self.borrowPublicRegistry().isHolderOfBag(bagId: bagId, holder: holder)
    }
    
    // Get all registered bag IDs
    access(all) fun getAllBags(): [UInt64] {
        return self.borrowPublicRegistry().getAllBags()
    }

    // Get all registered bag holders
    access(all) fun getAllBagsHolders(): [Address] {
        return self.borrowPublicRegistry().getAllBagsHolders()
    }

    // Get total number of registered bags
    access(all) fun getTotalBags(): Int {
        return self.borrowPublicRegistry().getAllBags().length
    }

    init() {
        self.RegistryStoragePath = /storage/BagRegistry
        
        let registry <- create Registry()
        self.account.storage.save(<- registry, to: self.RegistryStoragePath)
        
        emit RegistryInitialized()
    }
}