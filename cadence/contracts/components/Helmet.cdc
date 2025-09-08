access(all) contract Helmet {
    
    access(all) var helmets: [String]

    init() {
        self.helmets = [
            "Gas Mask",
            "Metallic Skullcap",
            "Great Helm",
            "Barbute",
            "Spangenhelm",
            "Kabuto",
            "Nasal Helm",
            "Morion",
            "Cyberpunk Visor",
            "Mind-Controlled",
            "Egyptian Crown",
            "Lunar Space"
        ]
    }
}
