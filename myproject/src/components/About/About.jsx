import './About.css'

function About({ user, setUser }) {


    return (

         <div class="content">
            <div class="text">
                <h1 class="tittle">ABOUT US</h1>
                <h1 class="text2">Company Background</h1>
                <div class="box">
                    <p>Ang Lechon Manok Ni Sr. Pedro, owned by Peter Unabia, founder of Anakciano Inc.,
                        is a Filipino restaurant chain that has gained culinary fame and fortune. The company,
                        founded by Peter and his mother Tering, provides livelihood opportunities for small farmers
                        in Misamis Oriental by contracting them as suppliers of chicken broilers. The foundation offers
                        free training on broiler breeding, chicks, feeds, and medicines and vaccines. Ang Lechon Manok ni
                        Sr. Pedro has 250 outlets in Metro Manila and other cities nationwide, and it has become a popular
                        choice for Pinoy palates. The company operates under Anakciano, Inc., with 16 million birds, with 2
                        million raised in company-owned commercial farms. The company also has 60 commercial farmers with an
                        average capacity of 40,000 birds and 4,000 backyard farmers with an average capacity of 500 birds,       
                        primarily located in the provinces of Bukidnon and Misamis Oriental.</p>    
                </div> 

                <div class="col">
                    <div class="column">

                        <h1 class="text3">Mission</h1>
                        <div class="box">
                            <p>To provide the most tasty, healthy, and locally produced grilled chicken meals for the community
                                and consumers. We are committed to giving customers with a dining experience that not only satisfies
                                their appetites but also promotes health and wellbeing. With a passion for quality and flavor, we hope
                                to become a landmark for consumers searching for a healthier and more delicious fast-food choice.</p>
                        </div>
                    </div>
                    <div class="column">

                        <h1 class="text3">Vision</h1>
                        <div class="box">
                            <p>To be acknowledged as the best place in the region that serves grilled chicken.
                                We aim to change how people view fast food by providing a menu that is delicious and
                                healthy. We are also committed to sustainability, and we will keep innovating with our
                                culinary techniques and recipes while continually acquiring the best products. As we develop,
                                we hope to create a society in which people may savor delicious grilled chicken dishes guilt-free
                                while also making a positive impact on a more environmentally friendly and health-conscious future.</p>
                        </div>
                    </div>
                </div>
            </div>


        </div>
     


    )
}

export default About;


