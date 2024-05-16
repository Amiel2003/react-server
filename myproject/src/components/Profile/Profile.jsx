import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import './Profile.css'
import { formatDateToLetters } from "../../functions/FormatDate";
import { decryptCollection } from "../../functions/DecryptUser";
import axios from "axios";
import RandomQuote from "./RandomQuote";

function Profile({ user, hiredDate }) {
    const [branch, setBranch] = useState('No branch assigned')
    const navigate = useNavigate();

    const _id = user.user._id
    const username = user.user.username
    const role = user.user.role
    const email_address = user.user.email_address
    const first_name = user.user.first_name
    const middle_name = user.user.middle_name
    const last_name = user.user.last_name
    const gender = user.user.gender
    const citizenship = user.user.citizenship
    const contact_number = user.user.contact_number
    const postal_code = user.user.postal_code
    const barangay = user.user.barangay
    const municipality = user.user.municipality
    const province = user.user.province
    const valid_id = user.user.valid_id
    const birth_certificate = user.user.birth_certificate
    const birth_date = user.user.birth_date

    useEffect(() => {
        console.log('birthday',user.user)
        if (!user || !user.user) {
            // User is not authenticated or user data is missing
            navigate('/');
        }
        axios.get(process.env.REACT_APP_BRANCHES_URL)
            .then((res) => {
                const data = decryptCollection(res.data.branches)
                getBranch(data.collection, _id)
            })
            .catch((error) => {
                console.error('Error retrieving branches collection ', error)
            })

    }, []);

    function getBranch(data, id) {
        if (role === 'supervisor') {
            data.forEach((element, index) => {
                if (element.supervisor._id === id) {
                    setBranch(element.branch_name)
                }

            });
        } else
            if (role === 'admin') {
                setBranch('All access')
            } else {
                data.forEach((branch, index) => {
                    branch.employees.forEach(element => {
                        if (element._id === id) {
                            setBranch(branch.branch_name)
                        }
                    });
                });
            }

    }

    return (
        <div className="container profileContainer">
            <div className="main-body">
                <nav aria-label="breadcrumb" className="main-breadcrumb">
                    <ol className="breadcrumb">

                    </ol>
                </nav>
                <div className="row gutters-sm">
                    <div className="col-md-4 mb-3">
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex flex-column align-items-center text-center">
                                    {gender === 'Male' ? (
                                         <img
                                         src="/images/male_avatar.jpg"
                                         alt="Admin"
                                         className="rounded-circle"
                                         width={150}/>
                                    ):(
                                        <img
                                        src="/images/female_avatar.jpg"
                                         alt="Admin"
                                         className="rounded-circle"
                                         width={150}/>
                                    )

                                    }
                                   
                                    <div className="mt-3">
                                        <h4>{first_name} {middle_name} {last_name}</h4>
                                        <p className="text-secondary mb-1">{username}</p>
                                        <p className="text-muted font-size-sm">{barangay} {municipality} {province} {postal_code}</p>
                                        <p className="text-muted font-size-sm">Birth Date: {birth_date ? (
                                            formatDateToLetters(birth_date)
                                        ):('Loading...')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card mt-3">
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                    <h6 className="mb-0">ID</h6>
                                    <span className="text-secondary">{_id}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                    <h6 className="mb-0">Email</h6>
                                    <span className="text-secondary">{email_address}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                    <h6 className="mb-0">Gender</h6>
                                    <span className="text-secondary">{gender}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                    <h6 className="mb-0">Contact Number</h6>
                                    <span className="text-secondary">{contact_number}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                    <h6 className="mb-0">Citizenship</h6>
                                    <span className="text-secondary">{citizenship}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="card mb-3">
                            <div className="card-body">
                                <h3>Employment Information</h3>
                                <br />
                                <div className="row">
                                    <div className="col-sm-3">
                                        <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                            <h6 className="mb-0">Hire Date</h6>
                                        </li>
                                    </div>
                                    {hiredDate ? (
                                        <div className="col-sm-9 text-secondary d-flex justify-content-between align-items-center flex-wrap">
                                            {formatDateToLetters(hiredDate)}
                                        </div>
                                    ) : (
                                        <div className="col-sm-9 text-secondary d-flex justify-content-between align-items-center flex-wrap">
                                            Loading...
                                        </div>
                                    )}
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3">
                                        <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                            <h6 className="mb-0">Role</h6>
                                        </li>
                                    </div>
                                    <div className="col-sm-9 text-secondary d-flex justify-content-between align-items-center flex-wrap">{role}</div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3">
                                        <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                            <h6 className="mb-0">Branch Assigned</h6>
                                        </li>
                                    </div>
                                    <div className="col-sm-9 text-secondary d-flex justify-content-between align-items-center flex-wrap">{branch}</div>
                                </div>
                                <hr />
                                
                            </div>
                        </div>
                        <br></br>
                        {/* <div className="card mb-3">
                            <RandomQuote />
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile;