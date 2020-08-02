class Character extends Ring {

    #queued_informations = [];    // Contains instances of Information objects provided to the Character instance.
    #displayed_informations = []; // Contains instances of Information objects to be displayed every frame.
    #is_movable;                  // Parameter to determine whether or not the Character instance is movable.
    #is_dragging = false;         // Parameter to determine whether or not the Character instance is moving.
    #offSetX = 0;                 // Character center_x and mouseX offset.
    #offSetY = 0;                 // Character center_y and mouseY offset.
    #character_links;             // Linked Characters associated with current instance of Character.

    /**
     * Constructor for Character instance.
     * @param {string}   name
     * @param {number}   id
     * @param {number}   center_x
     * @param {number}   center_y
     * @param {number}   diameter
     * @param {boolean}  is_movable
     * @param {string}   color
     * @param {string[]} [character_links]
     * @param {Object}   sketch
     */
    constructor(name, id, center_x, center_y, diameter, is_movable, color, character_links, sketch) {
        super(name, id, center_x, center_y, diameter, color, sketch);
        this.#is_movable = is_movable;
        if (character_links.length > 0) {
            this.#character_links = character_links;
        } else {
            this.#character_links = [this.getID()];
        }

    }

    /**
     * Method to display the current Character instance.
     */
    displayCharacter() {

        // Display circle and inner color.
        this.getSketch().push();
        this.getSketch().noStroke();
        this.getSketch().fill(this.getColor());
        this.getSketch().circle(this.getCenterX(), this.getCenterY(), this.getDiameter());
        this.getSketch().pop();

        // Display text.
        this.getSketch().push();
        this.getSketch().textSize(15);
        this.getSketch().fill(255);
        this.getSketch().text(this.getName(), this.getCenterX() - (this.getSketch().textWidth(this.getName()) / 2), this.getCenterY() + ((this.getSketch().textAscent() + this.getSketch().textDescent()) / 4));
        this.getSketch().pop();

        // Move character if it is a movable object.
        if (this.#is_movable) {
            this.displayMovingCharacter();
        }

    }

    /**
     * Method to add Information object to #queued_informations array.
     * @param {Information|RequestInfo|CommitInfo} info Instance of an Information object.
     */
    addSingleInformation(info) {
        let queued = false;
        let displayed = false;
        this.#queued_informations.forEach(queued_info => {
            // Check if info is in the queue already.
            if (info.getID() === queued_info.getID()) {
                queued = true;
            }
        })
        this.#displayed_informations.forEach(displayed_info => {
            // Check if info is displayed already.
            if(info.getID() === displayed_info.getID()) {
                displayed = true;
            }
        })
        // If info is not in the queue or displayed, then add it to the queue.
        if ( !(displayed || queued) ) {
            this.#queued_informations.push(info);
        }
    }

    /**
     * Method to add array of Information instances to #queued_informations array.
     * @param {Information[]|RequestInfo[]|CommitInfo[]} infos Array of Information objects.
     */
    addInformation(infos) {
        for(let i in infos) {
            this.addSingleInformation(infos[i]);
        }
    }

    /**
     * Method to add Information object from user to #queued_informations array.
     * @param {Information|RequestInfo|CommitInfo} info Instance of an Information object.
     */
    addSingleInformationFromUser(info) {
        this.#queued_informations.unshift(info);
    }

    /**
     * Method to display Information instances emitting from the Character.
     */
    emitInformation() {

        // Add new element to #displayed_information every multiple of the frameCount only if #informations is populated.
        if( (this.#queued_informations.length > 0) && (this.getSketch().frameCount % 30 === 0) ) {

            // Add Information instance to #displayed_informations array and initialize the propagation status.
            let info = this.#queued_informations.shift();
            info.initPropStatus();
            this.#displayed_informations.push(info);
        }

        // If in the display queue, then display to the screen and update diameter every frame.
        this.#displayed_informations.forEach(info => {
            info.displayInformation();        // Display current information.
            info.updateInformationDiameter(); // Update the information diameter for the next frame.
        })

    }

    /**
     * Method to display the Character instance while being dragged with the mouse.
     */
    displayMovingCharacter() {
        if (this.#is_dragging) {
            this.setCenterX(this.getSketch().mouseX + this.#offSetX);
            this.setCenterY(this.getSketch().mouseY + this.#offSetY);
            this.updateQueuedInformationPosition();
        }
    }

    /**
     * Method to check when mouse click is pressed on Character instance.
     */
    characterIsPressed() {
        // Check if cursor is over the Character and pressing
        let distance = this.getSketch().dist(this.getSketch().mouseX, this.getSketch().mouseY, this.getCenterX(), this.getCenterY());
        if (distance < this.getRadius()) {
            this.#is_dragging = true;
            this.#offSetX = this.getCenterX() - this.getSketch().mouseX;
            this.#offSetY = this.getCenterY() - this.getSketch().mouseY;
        }
    }

    /**
     * Method to check when mouse click is released from Character instance.
     */
    characterIsReleased() {
        this.#is_dragging = false;
    }

    /**
     * Method to update the Information instance position while Character is being dragged with the mouse.
     */
    updateQueuedInformationPosition() {
        this.#queued_informations.forEach(info => {
            info.setCenterX(this.getCenterX());
            info.setCenterY(this.getCenterY());
        })
    }

    /**
     * Reset the queued information.
     */
    resetQueuedInformation() {
        this.#displayed_informations = [];
    }

    /**
     * Reset the displayed information.
     */
    resetDisplayedInformation() {
        this.#displayed_informations = [];
    }

    /**
     * Get array of queued information.
     * @returns {Information[]|RequestInfo[]|CommitInfo[]}
     */
    getQueuedInformations() {
        return this.#queued_informations;
    }

    /**
     * Get array of displayed information.
     * @returns {Information[]}
     */
    getDisplayedInformations() {
        return this.#displayed_informations;
    }

    /**
     * Get particular displayed information.
     * @param {number} id
     */
    getDisplayedInformation(id) {
        return this.#displayed_informations.find(info => info.getID() === id);
    }

    /**
     * Remove the corresponding displayed information.
     * @param {Information} info
     */
    removeDisplayedInformation(info) {
        this.#displayed_informations.splice(this.#displayed_informations.indexOf(info), 1);
    }

    /**
     * Get if Character is movable.
     * @returns {boolean}
     */
    isMovable() {
        return this.#is_movable;
    }

    /**
     * Set if Character is movable.
     * @param {boolean} is_movable
     */
    setMovable(is_movable) {
        this.#is_movable = is_movable;
    }

    /**
     * Get the corresponding linked Character instance.
     * @returns {string}
     */
    getCharacterLinks() {
        return this.#character_links;
    }

    /**
     * Set the corresponding Character instance link.
     * @param {string[]} character_links
     */
    setCharacterLinks(character_links) {
        this.#character_links = character_links;
    }

}