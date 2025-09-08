access(all) contract Ring {
    
    access(all) var rings: [String]

    init() {
        self.rings = [
            "Band of Titans",
            "Warlord's Seal",
            "Oathkeeper's Hoop",
            "Grip of Might",
            "Titanium",
            "God Ring"
        ]
    }
}