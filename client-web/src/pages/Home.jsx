/* eslint-disable no-mixed-spaces-and-tabs */
import { useEffect, useMemo, useRef, useState } from 'react';
import Header from '../components/Header';
import SideBarLink from '../components/SidebarLink';
import { Outlet } from 'react-router-dom';
import { MdSpaceDashboard } from 'react-icons/md';
import { MdOutlineMenuBook } from 'react-icons/md';
import { Toast } from 'primereact/toast';
import { FaHistory, FaSwatchbook, FaUser, FaWpforms } from 'react-icons/fa';
function Home() {
	const [sideBar, setSideBar] = useState(window.innerWidth > 768);
	const [width, setWidth] = useState(window.innerWidth);
	const toast = useRef(null);
	const sideBarLinks = useMemo(() => {
		return {
			'ADMIN': [
				{
					to: '/admin',
					iconClass: <MdSpaceDashboard />,
					name: 'Dashboard',
				},
				{
					to: '/admin/genre',
					iconClass: <FaSwatchbook />,
					name: 'Genre',
				},
				{
					to: '/admin/librarians',
					iconClass: <FaUser />,
					name: 'Librarians',
				},
				{
					to: '/admin/book-usage',
					iconClass: <FaUser />,
					name: 'Book Usage',
				},
				{
					to: '/admin/user-activity',
					iconClass: <FaUser />,
					name: 'User Activity',
				},
				{
					to: '/admin/insights',
					iconClass: <FaUser />,
					name: 'Insights',
				},
			],
			'LIBRARIAN': [
				{
					to: '/librarian',
					iconClass: <MdSpaceDashboard />,
					name: 'Dashboard',
				},
				{
					to: '/librarian/book',
					iconClass: <MdOutlineMenuBook />,
					name: 'Books',
				},
				{
					to: '/librarian/bookReturn',
					iconClass: <FaWpforms />,
					name: 'Book Return',
				},
				{
					to: '/librarian/history',
					iconClass: <FaWpforms />,
					name: 'History',
				},
			],
			'USER': [
				{
					to: '/user',
					iconClass: <MdSpaceDashboard />,
					name: 'Dashboard',
				},
				{
					to: '/user/history',
					iconClass: <FaHistory />,
					name: 'History',
				},
				{
					to: '/user/paymentDue',
					iconClass: <FaHistory />,
					name: 'Payment Due',
				},
			],
		};
	}, []);

	function toggleSidebar(val) {
		val ? setSideBar(val) : setSideBar((prev) => !prev);
	}
	useEffect(() => {
		window.onoffline = () => {
			// console.log('offline');
			toast.current.show({
				severity: 'error',
				summary: 'Connection issue',
				detail: 'It looks like you are offline!!',
				sticky: true,
			});
		};
		window.ononline = () => {
			toast.current.clear();
		};

		window.onresize = () => {
			setWidth(window.innerWidth);
			if (window.innerWidth > 768) setSideBar(true);
			if (window.innerWidth < 768) setSideBar(false);
		};
		return () => {
			window.onresize = () => {};
			window.onoffline = () => {};
			window.ononline = () => {};
		};
	}, [toast]);

	return (
		<>
			<Toast ref={toast} />
			<Header toggleSidebar={toggleSidebar} />
			<div
				onClick={() => {
					toggleSidebar(false);
				}}
				className={`${
					sideBar && width < 768 ? 'block' : 'hidden'
				} top-0 absolute w-screen h-screen bg-black opacity-30 z-10 overflow-hidden`}
			></div>
			<div className="w-full h-full">
				<div className="flex flex-row h-[90vh] w-full">
					<div
						className="bg-darkBlue absolute md:static top-0 left-0 md:top-auto h-screen md:h-full overflow-y-auto transition-all z-20 shadow-blue-500 shadow-xl"
						style={{ left: sideBar ? 0 : -300, minWidth: 224 }}
					>
						{localStorage.getItem('role') &&
							sideBarLinks[localStorage.getItem('role')].map((ele) => {
								return (
									<SideBarLink
										to={ele.to}
										name={ele.name}
										iconClass={ele.iconClass}
										key={ele.name}
										end={ele.end}
										toggleSidebarClick={
											width < 768
												? () => {
														toggleSidebar(false);
												  }
												: undefined
										}
									/>
								);
							})}
					</div>
					<div
						className={`overflow-y-auto bg-grey-100 w-full h-full p-2 md:p-7 bg-slate-50 pb-20 md:pb-5 ${
							width < 768 ? '' : 'flexcalc'
						}`}
					>
						<Outlet />
					</div>
				</div>
			</div>
		</>
	);
}

export default Home;
